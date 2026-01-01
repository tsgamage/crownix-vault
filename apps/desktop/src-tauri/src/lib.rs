#[cfg_attr(mobile, tauri::mobile_entry_point)]
use std::{thread, time::Duration};
use tauri::{command, AppHandle};
use tauri_plugin_clipboard_manager::ClipboardExt;
mod vault_fs;

#[command]
fn copy_to_clipboard_with_timeout(app: AppHandle, text: String, timeout_secs: u64) {
    let _ = app.clipboard().write_text(text);

    let app_clone = app.clone();
    thread::spawn(move || {
        thread::sleep(Duration::from_secs(timeout_secs));
        let _ = app_clone.clipboard().write_text(String::new());
    });
}

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            copy_to_clipboard_with_timeout,
            vault_fs::pick_vault_folder,
            vault_fs::create_vault_file,
            vault_fs::pick_existing_vault_file,
            vault_fs::save_vault_file_atomic
        ])
        .setup(|app| {
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
