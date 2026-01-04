use tauri::Manager;

mod vault_fs;

// App entry point
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        // Plugins
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        // Commands
        .invoke_handler(tauri::generate_handler![
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
            // DEV-ONLY DevTools
            #[cfg(debug_assertions)]
            {
                let handle = app.handle();

                if let Some(window) = handle.get_webview_window("main") {
                    window.open_devtools();
                }
            }

            // DEV-ONLY logging
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
