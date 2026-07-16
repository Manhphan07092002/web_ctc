# Upload Directories

Thư mục này chứa các file được upload từ trang admin hoạt động.

## Cấu trúc thư mục:

- `images/` - Chứa hình ảnh hoạt động (JPG, PNG, GIF, WebP, BMP)
- `documents/` - Chứa tài liệu hoạt động (PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX)

## Bảo mật:

- File được đặt tên với timestamp và GUID để tránh trùng lặp
- Có validation loại file và kích thước
- Hình ảnh: tối đa 5MB
- Tài liệu: tối đa 10MB

## Quyền truy cập:

Đảm bảo thư mục này có quyền ghi cho IIS/ASP.NET:
- IIS_IUSRS: Full Control
- NETWORK SERVICE: Full Control
