<%@ Page Language="C#" %>
<!DOCTYPE html>
<html>
<head>
    <title>Redirecting...</title>
    <script type="text/javascript">
        // Get project ID from URL query string
        var urlParams = new URLSearchParams(window.location.search);
        var id = urlParams.get('id');
        
        if (id) {
            window.location.href = '/AdminProject/Edit?id=' + id;
        } else {
            window.location.href = '/admin/projects/';
        }
    </script>
</head>
<body>
    <p>Redirecting to <a href="/AdminProject/Index">Admin Projects</a>...</p>
</body>
</html>
