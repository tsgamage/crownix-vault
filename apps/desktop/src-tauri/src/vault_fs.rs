use serde::{Deserialize, Serialize};
use std::{
    fs::{self, File},
    io::{Read, Write},
    path::{Path, PathBuf},
    time::{SystemTime, UNIX_EPOCH},
};

use tauri::{command, AppHandle, Manager};
use tauri_plugin_dialog::DialogExt;
use tauri_plugin_opener::OpenerExt;

// =======================================================
// Constants
// =======================================================

const VAULT_FILE_NAME: &str = "CrownixVault.cxv";
const MAGIC: &str = "CROWNIX_VAULT";
const VERSION: u32 = 1;

// =======================================================
// Config model
// =======================================================

#[derive(Serialize, Deserialize)]
struct AppConfig {
    vault_path: String,
}

// =======================================================
// Result types (FINAL)
// =======================================================

#[derive(Serialize)]
pub struct SimpleResult {
    pub success: bool,
    pub message: Option<String>,
}

#[derive(Serialize)]
pub struct PickVaultFolderResult {
    pub success: bool,
    pub file_path: Option<String>,
    pub found: Option<bool>,
    pub multiple: Option<bool>,
    pub message: Option<String>,
}

#[derive(Serialize)]
pub struct PickVaultFileResult {
    pub success: bool,
    pub buffer: Option<Vec<u8>>,
    pub path: Option<String>,
    pub message: Option<String>,
}

#[derive(Serialize)]
pub struct AutoLoadResult {
    pub success: bool,
    pub buffer: Option<Vec<u8>>,
    pub path: Option<String>,
    pub backup: Option<bool>,
}

#[derive(Serialize)]
pub struct ExportBackupResult {
    pub success: bool,
    pub backup_path: Option<String>,
    pub message: Option<String>,
}

#[derive(Serialize)]
pub struct LoadSettingsResult {
    pub success: bool,
    pub data: Option<serde_json::Value>,
    pub message: Option<String>,
}

// =======================================================
// Config helpers
// =======================================================

fn app_dir(app: &AppHandle) -> Option<PathBuf> {
    app.path().app_config_dir().ok()
}

fn config_path(app: &AppHandle) -> Option<PathBuf> {
    Some(app_dir(app)?.join("config.json"))
}

fn settings_path(app: &AppHandle) -> Option<PathBuf> {
    Some(app_dir(app)?.join("settings.json"))
}

fn save_config(app: &AppHandle, vault_path: &Path) {
    let Some(path) = config_path(app) else { return };
    let _ = fs::create_dir_all(path.parent().unwrap());

    let cfg = AppConfig {
        vault_path: vault_path.to_string_lossy().to_string(),
    };

    let _ = fs::write(path, serde_json::to_vec(&cfg).unwrap());
}

fn load_config(app: &AppHandle) -> Option<PathBuf> {
    let path = config_path(app)?;
    let data = fs::read(path).ok()?;
    let cfg: AppConfig = serde_json::from_slice(&data).ok()?;
    Some(PathBuf::from(cfg.vault_path))
}

// =======================================================
// Backup helpers (SAFE LOCATION)
// =======================================================

fn backup_dir(app: &AppHandle) -> Option<PathBuf> {
    let dir = app_dir(app)?.join("backup");
    let _ = fs::create_dir_all(&dir);
    Some(dir)
}

fn backup_path(app: &AppHandle) -> Option<PathBuf> {
    Some(backup_dir(app)?.join("vault.bak"))
}

// =======================================================
// Validation helpers
// =======================================================

fn validate_vault_header(buffer: &[u8]) -> bool {
    if buffer.len() < 4 {
        return false;
    }

    let header_len = u32::from_le_bytes(buffer[0..4].try_into().unwrap()) as usize;

    let header_end = 4 + header_len;
    if buffer.len() < header_end {
        return false;
    }

    let header_bytes = &buffer[4..header_end];

    let header: serde_json::Value = match serde_json::from_slice(header_bytes) {
        Ok(h) => h,
        Err(_) => return false,
    };

    header["magic"] == MAGIC && header["version"] == VERSION
}

// =======================================================
// Pick vault folder (SCAN ONLY)
// =======================================================

#[command]
pub async fn pick_vault_folder(app: AppHandle) -> PickVaultFolderResult {
    let handle = app.clone();
    
    // Spawn blocking operation on a separate thread to prevent UI freeze
    let folder_task = tauri::async_runtime::spawn_blocking(move || {
        handle.dialog().file().blocking_pick_folder()
    });

    let folder_opt = match folder_task.await {
        Ok(res) => res,
        Err(_) => return PickVaultFolderResult {
            success: false,
            file_path: None,
            found: None,
            multiple: None,
            message: Some("Dialog thread failed".into()),
        },
    };

    let Some(folder) = folder_opt else {
        return PickVaultFolderResult {
            success: false,
            file_path: None,
            found: None,
            multiple: None,
            message: Some("Folder selection cancelled".into()),
        };
    };

    let Ok(folder_path) = folder.into_path() else {
        return PickVaultFolderResult {
            success: false,
            file_path: None,
            found: None,
            multiple: None,
            message: Some("Invalid folder path".into()),
        };
    };

    let count = fs::read_dir(&folder_path)
        .map(|rd| {
            rd.flatten()
                .filter(|e| e.path().extension().and_then(|e| e.to_str()) == Some("cxv"))
                .count()
        })
        .unwrap_or(0);

    PickVaultFolderResult {
        success: true,
        file_path: Some(
            folder_path
                .join(VAULT_FILE_NAME)
                .to_string_lossy()
                .to_string(),
        ),
        found: Some(count > 0),
        multiple: Some(count > 1),
        message: None,
    }
}

// =======================================================
// Create vault file
// =======================================================

#[command]
pub fn create_vault_file(app: AppHandle, file_path: String, buffer: Vec<u8>) -> SimpleResult {
    let path = PathBuf::from(file_path);

    match File::create(&path).and_then(|mut f| f.write_all(&buffer)) {
        Ok(_) => {
            save_config(&app, &path);
            SimpleResult {
                success: true,
                message: None,
            }
        }
        Err(_) => SimpleResult {
            success: false,
            message: Some("Failed to create vault file".into()),
        },
    }
}

// =======================================================
// Pick existing vault file
// =======================================================

#[command]
pub async fn pick_existing_vault_file(app: AppHandle) -> PickVaultFileResult {
    let handle = app.clone();

    // Spawn blocking operation on a separate thread
    let file_task = tauri::async_runtime::spawn_blocking(move || {
        handle
            .dialog()
            .file()
            .add_filter("Crownix Vault", &["cxv"])
            .blocking_pick_file()
    });

    let file_opt = match file_task.await {
        Ok(res) => res,
        Err(_) => return PickVaultFileResult {
            success: false,
            buffer: None,
            path: None,
            message: Some("Dialog thread failed".into()),
        },
    };

    let Some(file) = file_opt else {
        return PickVaultFileResult {
            success: false,
            buffer: None,
            path: None,
            message: Some("File selection cancelled".into()),
        };
    };

    let Ok(path) = file.into_path() else {
        return PickVaultFileResult {
            success: false,
            buffer: None,
            path: None,
            message: Some("Invalid file path".into()),
        };
    };

    let mut buffer = Vec::new();
    match File::open(&path).and_then(|mut f| f.read_to_end(&mut buffer)) {
        Ok(_) => {
            save_config(&app, &path);
            PickVaultFileResult {
                success: true,
                buffer: Some(buffer),
                path: Some(path.to_string_lossy().to_string()),
                message: None,
            }
        }
        Err(_) => PickVaultFileResult {
            success: false,
            buffer: None,
            path: None,
            message: Some("Failed to read vault file".into()),
        },
    }
}

// =======================================================
// Atomic save + SAFE backup
// =======================================================

#[command]
pub fn save_vault_file_atomic(app: AppHandle, vault_path: String, buffer: Vec<u8>) -> SimpleResult {
    let path = PathBuf::from(vault_path);

    if let Some(bak) = backup_path(&app) {
        if path.exists() {
            let _ = fs::copy(&path, &bak);
        }
    }

    let tmp = path.with_extension("cxv.tmp");

    if File::create(&tmp)
        .and_then(|mut f| f.write_all(&buffer))
        .is_err()
    {
        return SimpleResult {
            success: false,
            message: Some("Failed to write temp file".into()),
        };
    }

    if fs::rename(&tmp, &path).is_err() {
        return SimpleResult {
            success: false,
            message: Some("Failed to replace vault file".into()),
        };
    }

    save_config(&app, &path);
    SimpleResult {
        success: true,
        message: None,
    }
}

// =======================================================
// Auto-load vault
// =======================================================

#[command]
pub fn auto_load_vault(app: AppHandle) -> AutoLoadResult {
    let Some(path) = load_config(&app) else {
        return AutoLoadResult {
            success: false,
            buffer: None,
            path: None,
            backup: Some(false),
        };
    };

    let mut buffer = Vec::new();
    if File::open(&path)
        .and_then(|mut f| f.read_to_end(&mut buffer))
        .is_ok()
        && validate_vault_header(&buffer)
    {
        return AutoLoadResult {
            success: true,
            buffer: Some(buffer),
            path: Some(path.to_string_lossy().to_string()),
            backup: None,
        };
    }

    let has_backup = backup_path(&app).map(|b| b.exists()).unwrap_or(false);
    AutoLoadResult {
        success: false,
        buffer: None,
        path: None,
        backup: Some(has_backup),
    }
}

// =======================================================
// Export backup
// =======================================================

#[command]
pub async fn export_backup_vault(app: AppHandle) -> ExportBackupResult {
    let Some(bak) = backup_path(&app) else {
        return ExportBackupResult {
            success: false,
            backup_path: None,
            message: Some("No backup directory".into()),
        };
    };

    if !bak.exists() {
        return ExportBackupResult {
            success: false,
            backup_path: None,
            message: Some("No backup file found".into()),
        };
    }

    let handle = app.clone();
    
    // Spawn blocking operation on a separate thread
    let folder_task = tauri::async_runtime::spawn_blocking(move || {
        handle.dialog().file().blocking_pick_folder()
    });

    let folder_opt = match folder_task.await {
        Ok(res) => res,
        Err(_) => return ExportBackupResult {
            success: false,
            backup_path: None,
            message: Some("Dialog thread failed".into()),
        },
    };

    let Some(folder) = folder_opt else {
        return ExportBackupResult {
            success: false,
            backup_path: None,
            message: Some("Export cancelled".into()),
        };
    };

    let Ok(folder_path) = folder.into_path() else {
        return ExportBackupResult {
            success: false,
            backup_path: None,
            message: Some("Invalid folder".into()),
        };
    };

    let ts = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs();
    
    let export_path = folder_path.join(format!("CrownixVault_backup_{}.cxv", ts));

    match fs::copy(&bak, &export_path) {
        Ok(_) => {
            let _ = app
                .opener()
                .open_path(folder_path.to_string_lossy().to_string(), None::<String>);
            let _ = fs::remove_file(&bak);
            ExportBackupResult {
                success: true,
                backup_path: Some(export_path.to_string_lossy().to_string()),
                message: None,
            }
        }
        Err(_) => ExportBackupResult {
            success: false,
            backup_path: None,
            message: Some("Failed to export backup".into()),
        },
    }
}

// =======================================================
// App settings (NON-VAULT)
// =======================================================

#[command]
pub fn save_app_settings(app: AppHandle, settings: serde_json::Value) -> SimpleResult {
    let Some(path) = settings_path(&app) else {
        return SimpleResult {
            success: false,
            message: Some("Config directory unavailable".into()),
        };
    };

    match fs::write(path, settings.to_string()) {
        Ok(_) => SimpleResult {
            success: true,
            message: None,
        },
        Err(_) => SimpleResult {
            success: false,
            message: Some("Failed to save settings".into()),
        },
    }
}

#[command]
pub fn load_app_settings(app: AppHandle) -> LoadSettingsResult {
    let Some(path) = settings_path(&app) else {
        return LoadSettingsResult {
            success: false,
            data: None,
            message: Some("Config directory unavailable".into()),
        };
    };

    if !path.exists() {
        return LoadSettingsResult {
            success: true,
            data: Some(serde_json::json!({})),
            message: None,
        };
    }

    match fs::read_to_string(&path)
        .ok()
        .and_then(|c| serde_json::from_str(&c).ok())
    {
        Some(json) => LoadSettingsResult {
            success: true,
            data: Some(json),
            message: None,
        },
        None => LoadSettingsResult {
            success: false,
            data: None,
            message: Some("Invalid settings file".into()),
        },
    }
}

// =======================================================
// Clear config
// =======================================================

#[command]
pub fn clear_vault_config(app: AppHandle) -> SimpleResult {
    if let Some(path) = config_path(&app) {
        let _ = fs::remove_file(path);
    }

    SimpleResult {
        success: true,
        message: None,
    }
}
