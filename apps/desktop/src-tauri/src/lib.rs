use std::{thread, time::Duration};

use tauri::{command, AppHandle};
use tauri_plugin_clipboard_manager::ClipboardExt;

mod vault_fs;

// =======================================================
// Clipboard with auto-clear
// =======================================================

#[command]
fn copy_to_clipboard_with_timeout(app: AppHandle, text: String, timeout_secs: u64) {
    let _ = app.clipboard().write_text(text);

    let app_clone = app.clone();
    thread::spawn(move || {
        thread::sleep(Duration::from_secs(timeout_secs));
        let _ = app_clone.clipboard().write_text(String::new());
    });
}

// =======================================================
// App entry point
// =======================================================

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        // Plugins
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        // Commands
        .invoke_handler(tauri::generate_handler![
            copy_to_clipboard_with_timeout,
            vault_fs::pick_vault_folder,
            vault_fs::create_vault_file,
            vault_fs::pick_existing_vault_file,
            vault_fs::save_vault_file_atomic,
            vault_fs::auto_load_vault,
            vault_fs::export_backup_vault,
            vault_fs::clear_vault_config,
            vault_fs::load_app_settings,
            vault_fs::save_app_settings,
        ])
        // Setup
        .setup(|app| {
            // 🔧 DEV-ONLY DevTools
            #[cfg(debug_assertions)]
            {
                let handle = app.handle();

                if let Some(window) = handle.get_webview_window("main") {
                    window.open_devtools(); // ✅ correct in Tauri v2
                }
            }

            // 🔧 DEV-ONLY logging
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
