use serde::Serialize;
use std::{
    fs::{self, File},
    io::{Read, Write},
    path::{Path, PathBuf},
};

use tauri::{command, AppHandle};
use tauri_plugin_dialog::DialogExt;

// =======================================================
// Result types (EXACT contract)
// =======================================================

#[derive(Serialize)]
#[serde(tag = "success")]
pub enum PickVaultFolderResult {
    #[serde(rename = "true")]
    Ok {
        file_path: String, // selectedFolder/CrownixVault.cxv
        found: bool,
        multiple: bool,
    },

    #[serde(rename = "false")]
    Err {
        message: String,
    },
}

#[derive(Serialize)]
#[serde(tag = "success")]
pub enum PickVaultFileResult {
    #[serde(rename = "true")]
    Ok {
        buffer: Vec<u8>,
        path: String,
    },

    #[serde(rename = "false")]
    Err {
        message: String,
    },
}

#[derive(Serialize)]
#[serde(tag = "success")]
pub enum SimpleResult {
    #[serde(rename = "true")]
    Ok,

    #[serde(rename = "false")]
    Err {
        message: String,
    },
}

// =======================================================
// Helpers
// =======================================================

fn find_cxv_files(folder: &Path) -> Result<Vec<PathBuf>, String> {
    let mut files = Vec::new();

    for entry in fs::read_dir(folder)
        .map_err(|_| "Cannot read selected folder".to_string())?
    {
        let entry = entry.map_err(|_| "Invalid folder entry".to_string())?;
        let path = entry.path();

        if path.is_file()
            && path.extension().and_then(|e| e.to_str()) == Some("cxv")
        {
            files.push(path);
        }
    }

    Ok(files)
}

// =======================================================
// 1️⃣ Pick folder and SCAN only
// =======================================================

#[command]
pub fn pick_vault_folder(app: AppHandle) -> PickVaultFolderResult {
    let Some(folder) = app.dialog().file().blocking_pick_folder() else {
        return PickVaultFolderResult::Err {
            message: "Folder selection cancelled".into(),
        };
    };

    let Ok(folder_path) = folder.into_path() else {
        return PickVaultFolderResult::Err {
            message: "Invalid folder path".into(),
        };
    };

    let cxv_files = match find_cxv_files(&folder_path) {
        Ok(v) => v,
        Err(e) => return PickVaultFolderResult::Err { message: e },
    };

    let (found, multiple) = match cxv_files.len() {
        0 => (false, false),
        1 => (true, false),
        _ => (true, true),
    };

    let file_path = folder_path.join("CrownixVault.cxv");

    PickVaultFolderResult::Ok {
        file_path: file_path.to_string_lossy().to_string(),
        found,
        multiple,
    }
}

// =======================================================
// 2️⃣ Create vault file (ONLY here)
// =======================================================

#[command]
pub fn create_vault_file(
    file_path: String,
    buffer: Vec<u8>,
) -> SimpleResult {
    let path = PathBuf::from(file_path);

    let mut file = match File::create(&path) {
        Ok(f) => f,
        Err(_) => {
            return SimpleResult::Err {
                message: "Failed to create vault file".into(),
            }
        }
    };

    if file.write_all(&buffer).is_err() {
        return SimpleResult::Err {
            message: "Failed to write vault file".into(),
        };
    }

    // 🔒 TODO: persist vault path

    SimpleResult::Ok
}

// =======================================================
// 3️⃣ Pick existing .cxv file
// =======================================================

#[command]
pub fn pick_existing_vault_file(app: AppHandle) -> PickVaultFileResult {
    let Some(file) = app
        .dialog()
        .file()
        .add_filter("Crownix Vault", &["cxv"])
        .blocking_pick_file()
    else {
        return PickVaultFileResult::Err {
            message: "File selection cancelled".into(),
        };
    };

    let Ok(path) = file.into_path() else {
        return PickVaultFileResult::Err {
            message: "Invalid file path".into(),
        };
    };

    let mut file = match File::open(&path) {
        Ok(f) => f,
        Err(_) => {
            return PickVaultFileResult::Err {
                message: "Failed to open vault file".into(),
            }
        }
    };

    let mut buffer = Vec::new();
    if file.read_to_end(&mut buffer).is_err() {
        return PickVaultFileResult::Err {
            message: "Failed to read vault file".into(),
        };
    }

    // 🔒 TODO: persist vault path

    PickVaultFileResult::Ok {
        buffer,
        path: path.to_string_lossy().to_string(),
    }
}

// =======================================================
// 4️⃣ Atomic save (same folder, correct tmp)
// =======================================================

#[command]
pub fn save_vault_file_atomic(
    vault_path: String,
    buffer: Vec<u8>,
) -> SimpleResult {
    let path = PathBuf::from(&vault_path);

    let file_name = match path.file_name() {
        Some(n) => n.to_string_lossy(),
        None => {
            return SimpleResult::Err {
                message: "Invalid vault file path".into(),
            }
        }
    };

    let tmp_path = path.with_file_name(format!("{}.tmp", file_name));

    {
        let mut tmp = match File::create(&tmp_path) {
            Ok(f) => f,
            Err(_) => {
                return SimpleResult::Err {
                    message: "Failed to create temp file".into(),
                }
            }
        };

        if tmp.write_all(&buffer).is_err() {
            return SimpleResult::Err {
                message: "Failed to write temp file".into(),
            };
        }
    }

    if fs::rename(&tmp_path, &path).is_err() {
        return SimpleResult::Err {
            message: "Failed to replace vault file".into(),
        };
    }

    SimpleResult::Ok
}
