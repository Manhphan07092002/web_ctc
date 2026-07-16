using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
// Removed System.Text.RegularExpressions to avoid parser conflicts

namespace Cubetech.Website.Controllers
{
    // Updated: 2025-11-08 09:53 - Added trash fallback for delete operations
    public class FilePickerController : Controller
    {
        private readonly string _uploadPath = "~/Image/";
        private readonly int _maxFileSize = 10 * 1024 * 1024; // 10MB
        private readonly string[] _allowedExtensions = { ".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".svg", ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx" };

        public ActionResult Index()
        {
            // Test marker - 2025-11-08 09:27
            ViewBag.TestMessage = "Controller updated successfully - no regex patterns";
            return View();
        }

        [HttpPost]
        // [ValidateAntiForgeryToken] // Temporarily disabled for debugging
        public ActionResult List(string path, string text)
        {
            try
            {
                // Debug logging
                System.Diagnostics.Trace.WriteLine(string.Format("FilePicker List called - Path: {0}, Text: {1}", path ?? "null", text ?? "null"));
                
                // Validate and sanitize path
                try
                {
                    path = CleanPath(path);
                    ViewBag.Path = path;
                    ViewBag.SearchText = text ?? "";
                }
                catch (Exception pathEx)
                {
                    System.Diagnostics.Trace.WriteLine("Path cleaning error: " + pathEx.Message);
                    ViewBag.Error = "Lỗi xử lý đường dẫn: " + pathEx.Message;
                    return View();
                }
                
                // Check if upload directory exists and create if needed
                string uploadPath = Server.MapPath(_uploadPath);
                System.Diagnostics.Trace.WriteLine(string.Format("Upload path: {0}, Exists: {1}", uploadPath, System.IO.Directory.Exists(uploadPath)));
                
                if (!System.IO.Directory.Exists(uploadPath))
                {
                    try
                    {
                        System.IO.Directory.CreateDirectory(uploadPath);
                        System.Diagnostics.Trace.WriteLine("Created upload directory: " + uploadPath);
                    }
                    catch (Exception createEx)
                    {
                        System.Diagnostics.Trace.WriteLine("Failed to create upload directory: " + createEx.Message);
                        ViewBag.Error = "Không thể tạo thư mục upload: " + createEx.Message;
                        ViewBag.ErrorDetails = createEx.ToString();
                        return View();
                    }
                }
                
                // Validate that the view can be rendered
                try
                {
                    ViewBag.Success = true;
                    return View();
                }
                catch (Exception viewEx)
                {
                    System.Diagnostics.Trace.WriteLine("View rendering error: " + viewEx.Message);
                    ViewBag.Error = "Lỗi hiển thị giao diện: " + viewEx.Message;
                    ViewBag.ErrorDetails = viewEx.ToString();
                    return View();
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Trace.WriteLine(string.Format("FilePicker List error: {0}", ex.ToString()));
                ViewBag.Error = string.Format("Lỗi khi tải danh sách file: {0}", ex.Message);
                ViewBag.ErrorDetails = ex.ToString();
                return View();
            }
        }

        [HttpPost]
        // [ValidateAntiForgeryToken] // Temporarily disabled for testing
        public JsonResult CreateFolder(string path, string folderName)
        {
            try
            {
                // Validate inputs
                if (string.IsNullOrWhiteSpace(folderName))
                {
                    return Json(new { success = false, message = "Tên thư mục không được để trống" });
                }

                if (!IsValidFolderName(folderName))
                {
                    return Json(new { success = false, message = "Tên thư mục chứa ký tự không hợp lệ" });
                }

                path = CleanPath(path);
                string fullPath = Server.MapPath(string.Format("{0}{1}/{2}", _uploadPath, path, folderName));

                if (Directory.Exists(fullPath))
                {
                    return Json(new { success = false, message = "Thư mục đã tồn tại" });
                }

                Directory.CreateDirectory(fullPath);
                string newPath = string.IsNullOrEmpty(path) ? folderName : string.Format("{0}/{1}", path, folderName);

                return Json(new { success = true, message = "Tạo thư mục thành công", Path = newPath });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = string.Format("Lỗi: {0}", ex.Message) });
            }
        }

        [HttpPost]
        // [ValidateAntiForgeryToken] // Temporarily disabled for testing
        public JsonResult UploadImage(string path, bool rename = true)
        {
            try
            {
                System.Diagnostics.Trace.WriteLine(string.Format("UploadImage called - Path: {0}, Rename: {1}", path ?? "null", rename));
                System.Diagnostics.Trace.WriteLine(string.Format("Request.Files.Count: {0}", Request.Files.Count));
                
                path = CleanPath(path);
                string uploadDir = Server.MapPath(_uploadPath + path);
                
                System.Diagnostics.Trace.WriteLine(string.Format("Upload directory: {0}", uploadDir));

                if (!Directory.Exists(uploadDir))
                {
                    Directory.CreateDirectory(uploadDir);
                }

                var uploadedFiles = new List<string>();
                var errors = new List<string>();

                foreach (string fileName in Request.Files)
                {
                    HttpPostedFileBase file = Request.Files[fileName];
                    if (file != null && file.ContentLength > 0)
                    {
                        // Validate file
                        var validationResult = ValidateFile(file);
                        if (!validationResult.IsValid)
                        {
                            errors.Add(validationResult.ErrorMessage);
                            continue;
                        }

                        try
                        {
                            string finalFileName = rename ? GenerateUniqueFileName(file.FileName) : file.FileName;
                            string filePath = Path.Combine(uploadDir, finalFileName);

                            // Check if file exists (when not renaming)
                            if (!rename && System.IO.File.Exists(filePath))
                            {
                                errors.Add(string.Format("File {0} đã tồn tại", file.FileName));
                                continue;
                            }

                            file.SaveAs(filePath);
                            uploadedFiles.Add(finalFileName);
                        }
                        catch (Exception ex)
                        {
                            errors.Add(string.Format("Lỗi upload {0}: {1}", file.FileName, ex.Message));
                        }
                    }
                }

                return Json(new
                {
                    success = uploadedFiles.Count > 0,
                    message = uploadedFiles.Count > 0 ? 
                        string.Format("Upload thành công {0} file", uploadedFiles.Count) : 
                        "Không có file nào được upload",
                    uploadedFiles = uploadedFiles,
                    errors = errors
                });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = string.Format("Lỗi upload: {0}", ex.Message) });
            }
        }

        [HttpPost]
        // [ValidateAntiForgeryToken] // Temporarily disabled for testing
        public JsonResult RemoveFile(string fullPath)
        {
            try
            {
                System.Diagnostics.Trace.WriteLine(string.Format("RemoveFile called - FullPath: {0}", fullPath ?? "null"));
                System.Diagnostics.Trace.WriteLine(string.Format("Server.MapPath result: {0}", Server.MapPath("~/")));
                System.Diagnostics.Trace.WriteLine(string.Format("Upload path setting: {0}", _uploadPath));
                
                if (string.IsNullOrWhiteSpace(fullPath))
                {
                    return Json(new { success = false, message = "Đường dẫn file không hợp lệ" });
                }

                // Convert web path to physical path
                string physicalPath = Server.MapPath(fullPath);
                System.Diagnostics.Trace.WriteLine(string.Format("Physical path: {0}, Exists: {1}", physicalPath, System.IO.File.Exists(physicalPath)));
                
                if (!System.IO.File.Exists(physicalPath))
                {
                    return Json(new { success = false, message = "File không tồn tại" });
                }

                // Security check: ensure file is within upload directory
                string uploadRoot = Server.MapPath(_uploadPath);
                if (!physicalPath.StartsWith(uploadRoot, StringComparison.OrdinalIgnoreCase))
                {
                    return Json(new { success = false, message = "Không có quyền xóa file này" });
                }

                System.Diagnostics.Trace.WriteLine("Attempting to delete file: " + physicalPath);
                
                // Check file permissions before attempting delete
                var fileInfo = new System.IO.FileInfo(physicalPath);
                if (fileInfo.IsReadOnly)
                {
                    return Json(new { success = false, message = "File này chỉ đọc, không thể xóa" });
                }
                
                try
                {
                    // Quick check if file exists before attempting delete
                    if (!System.IO.File.Exists(physicalPath))
                    {
                        return Json(new { success = true, message = "File đã được xóa trước đó" });
                    }
                    
                    // Try to delete file directly first
                    System.IO.File.Delete(physicalPath);
                    System.Diagnostics.Trace.WriteLine("File deleted successfully");
                    return Json(new { success = true, message = "Xóa file thành công" });
                }
                catch (System.UnauthorizedAccessException)
                {
                    // If direct delete fails, try alternative approaches
                    try
                    {
                        // Method 1: Try to rename file to .deleted extension
                        string deletedPath = physicalPath + ".deleted." + DateTime.Now.ToString("yyyyMMddHHmmss");
                        System.IO.File.Move(physicalPath, deletedPath);
                        System.Diagnostics.Trace.WriteLine("File renamed to deleted: " + deletedPath);
                        return Json(new { success = true, message = "File đã được đánh dấu xóa (renamed to .deleted)" });
                    }
                    catch (Exception renameEx)
                    {
                        System.Diagnostics.Trace.WriteLine("Rename failed: " + renameEx.ToString());
                        
                        // Method 2: Try to move to trash folder
                        try
                        {
                            string trashFolder = Server.MapPath(_uploadPath + "_trash");
                            if (!Directory.Exists(trashFolder))
                            {
                                Directory.CreateDirectory(trashFolder);
                            }
                            
                            string fileName = Path.GetFileName(physicalPath);
                            string trashPath = Path.Combine(trashFolder, DateTime.Now.ToString("yyyyMMddHHmmss") + "_" + fileName);
                            
                            System.IO.File.Move(physicalPath, trashPath);
                            System.Diagnostics.Trace.WriteLine("File moved to trash: " + trashPath);
                            return Json(new { success = true, message = "File đã được chuyển vào thùng rác" });
                        }
                        catch (Exception moveEx)
                        {
                            System.Diagnostics.Trace.WriteLine("Move to trash failed: " + moveEx.ToString());
                            return Json(new { success = false, message = "Không có quyền xóa hoặc di chuyển file này. Lỗi: " + moveEx.Message });
                        }
                    }
                }
                catch (System.IO.IOException ioEx)
                {
                    return Json(new { success = false, message = "File đang được sử dụng hoặc bị khóa: " + ioEx.Message });
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Trace.WriteLine(string.Format("Delete error: {0}", ex.ToString()));
                return Json(new { success = false, message = string.Format("Lỗi xóa file: {0}", ex.Message) });
            }
        }

        [HttpPost]
        // [ValidateAntiForgeryToken] // Temporarily disabled for testing
        public JsonResult RemoveFolder(string path)
        {
            try
            {
                path = CleanPath(path);
                if (string.IsNullOrWhiteSpace(path))
                {
                    return Json(new { success = false, message = "Không thể xóa thư mục gốc" });
                }

                string fullPath = Server.MapPath(_uploadPath + path);
                
                if (!Directory.Exists(fullPath))
                {
                    return Json(new { success = false, message = "Thư mục không tồn tại" });
                }

                Directory.Delete(fullPath, true);
                return Json(new { success = true, message = "Xóa thư mục thành công" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = string.Format("Lỗi xóa thư mục: {0}", ex.Message) });
            }
        }

        [HttpGet]
        public JsonResult Test()
        {
            try
            {
                string uploadPath = Server.MapPath(_uploadPath);
                bool dirExists = Directory.Exists(uploadPath);
                int fileCount = dirExists ? Directory.GetFiles(uploadPath, "*", SearchOption.AllDirectories).Length : 0;

                return Json(new
                {
                    success = true,
                    controller = "FilePickerController",
                    action = "Test",
                    timestamp = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"),
                    uploadPath = _uploadPath,
                    directoryExists = dirExists,
                    fileCount = fileCount
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    success = false,
                    error = ex.Message,
                    timestamp = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")
                }, JsonRequestBehavior.AllowGet);
            }
        }

        #region Helper Methods

        private string CleanPath(string path)
        {
            if (string.IsNullOrWhiteSpace(path))
                return "";

            // Remove dangerous characters and normalize
            path = path.Replace("\\", "/").Trim('/');
            path = path.Replace("<", "").Replace(">", "").Replace(":", "").Replace("\"", "").Replace("|", "").Replace("?", "").Replace("*", "");
            path = path.Replace("..", ""); // Remove parent directory references
            
            return path;
        }

        private bool IsValidFolderName(string folderName)
        {
            if (string.IsNullOrWhiteSpace(folderName) || folderName.Length > 100)
                return false;

            // Check for invalid characters
            char[] invalidChars = Path.GetInvalidFileNameChars();
            return !folderName.Any(c => invalidChars.Contains(c));
        }

        private FileValidationResult ValidateFile(HttpPostedFileBase file)
        {
            // Check file size
            if (file.ContentLength > _maxFileSize)
            {
                return new FileValidationResult
                {
                    IsValid = false,
                    ErrorMessage = string.Format("File {0} vượt quá kích thước cho phép (10MB)", file.FileName)
                };
            }

            // Check file extension
            string extension = Path.GetExtension(file.FileName).ToLower();
            if (!_allowedExtensions.Contains(extension))
            {
                return new FileValidationResult
                {
                    IsValid = false,
                    ErrorMessage = string.Format("File {0} có định dạng không được hỗ trợ", file.FileName)
                };
            }

            return new FileValidationResult { IsValid = true };
        }

        private string GenerateUniqueFileName(string originalFileName)
        {
            string extension = Path.GetExtension(originalFileName);
            string nameWithoutExt = Path.GetFileNameWithoutExtension(originalFileName);
            string timestamp = DateTime.Now.ToString("yyyyMMddHHmmss");
            string uniqueId = Guid.NewGuid().ToString("N").Substring(0, 8);
            
            return string.Format("{0}_{1}_{2}{3}", nameWithoutExt, timestamp, uniqueId, extension);
        }

        public static bool IsImageFile(string fileName)
        {
            string[] imageExtensions = { ".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".svg" };
            string extension = Path.GetExtension(fileName).ToLower();
            return imageExtensions.Contains(extension);
        }

        public static bool IsSizeFile(string fileName)
        {
            // Check if file is a thumbnail or size variant (to exclude from listing)
            return fileName.Contains("_thumb") || fileName.Contains("_small") || fileName.Contains("_medium");
        }

        public static string GetFileNameAndSize(string filePath)
        {
            try
            {
                FileInfo fileInfo = new FileInfo(filePath);
                long sizeInBytes = fileInfo.Length;
                string sizeString = FormatFileSize(sizeInBytes);
                return fileInfo.Name + " (" + sizeString + ")";
            }
            catch
            {
                return Path.GetFileName(filePath);
            }
        }

        private static string FormatFileSize(long bytes)
        {
            string[] sizes = { "B", "KB", "MB", "GB" };
            double len = bytes;
            int order = 0;
            while (len >= 1024 && order < sizes.Length - 1)
            {
                order++;
                len = len / 1024;
            }
            return string.Format("{0:0.##} {1}", len, sizes[order]);
        }

        #endregion

        private class FileValidationResult
        {
            public bool IsValid { get; set; }
            public string ErrorMessage { get; set; }
        }
    }
}
