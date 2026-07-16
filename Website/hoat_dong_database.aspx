<%@ Page Language="C#" %>
<%@ Import Namespace="System.Data.SqlClient" %>
<%@ Import Namespace="System.Data" %>
<%@ Import Namespace="System.Configuration" %>

<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hoạt động - CÔNG TY CỔ PHẦN XÂY LẮP BƯU ĐIỆN MIỀN TRUNG</title>
    <meta name="description" content="Cập nhật các hoạt động mới nhất của Công ty Cổ phần Xây lắp Bưu điện Miền Trung">
    <meta name="keywords" content="hoạt động, tin tức, sự kiện, công ty, xây dựng, bưu điện, miền trung">
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    
    <style>
        :root {
            --primary: #2563eb;
            --secondary: #1e40af;
            --success: #10b981;
            --warning: #f59e0b;
            --danger: #ef4444;
            --info: #06b6d4;
            --bg-primary: #ffffff;
            --bg-secondary: #f8fafc;
            --text-primary: #1e293b;
            --text-secondary: #475569;
            --text-muted: #64748b;
            --border: #e2e8f0;
            --shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
            --radius: 0.75rem;
            --space: 1rem;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', sans-serif;
            line-height: 1.6;
            color: var(--text-primary);
            background: var(--bg-secondary);
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1rem;
        }


        /* Activities Grid */
        .activities-section {
            padding: 2rem 0;
            margin-top: 2rem;
        }

        .activities-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }

        .activity-card {
            background: var(--bg-primary);
            border-radius: var(--radius);
            overflow: hidden;
            box-shadow: var(--shadow);
            transition: 0.3s ease;
            border: 1px solid var(--border);
            cursor: pointer;
            position: relative;
        }

        .activity-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 25px -3px rgb(0 0 0 / 0.1);
            border-color: var(--primary);
        }

        .activity-card::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(37, 99, 235, 0.05);
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
        }

        .activity-card:hover::after {
            opacity: 1;
        }

        /* Click indicator */
        .activity-card::before {
            content: '👁️ Xem chi tiết';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(37, 99, 235, 0.9);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 1rem;
            font-size: 0.875rem;
            font-weight: 500;
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 10;
            pointer-events: none;
            backdrop-filter: blur(10px);
        }

        .activity-card:hover::before {
            opacity: 1;
        }

        .activity-image {
            width: 100%;
            height: 200px;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 3rem;
            position: relative;
        }

        .activity-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .activity-content {
            padding: 1.5rem;
        }

        .activity-meta {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1rem;
            font-size: 0.875rem;
            color: var(--text-muted);
        }

        .activity-type {
            display: inline-flex;
            align-items: center;
            gap: 0.25rem;
            padding: 0.25rem 0.75rem;
            border-radius: 1rem;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
        }

        .type-event {
            background: #dbeafe;
            color: #1e40af;
        }

        .type-activity {
            background: #d1fae5;
            color: #065f46;
        }

        .type-notification {
            background: #fef3c7;
            color: #92400e;
        }

        .type-schedule {
            background: #e0e7ff;
            color: #3730a3;
        }

        .activity-title {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 0.75rem;
            line-height: 1.4;
        }

        .activity-description {
            color: var(--text-secondary);
            margin-bottom: 1rem;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        .activity-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 1rem;
            border-top: 1px solid var(--border);
        }

        .activity-date {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: var(--text-muted);
            font-size: 0.875rem;
        }

        .activity-status {
            padding: 0.25rem 0.75rem;
            border-radius: 1rem;
            font-size: 0.75rem;
            font-weight: 600;
        }

        .status-published {
            background: #d1fae5;
            color: #065f46;
        }

        .status-draft {
            background: #fef3c7;
            color: #92400e;
        }

        /* Advanced UI Components */

        /* Grid View */
        .activities-grid.grid-view {
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
        }

        /* List View */
        .activities-grid.list-view {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .activities-grid.list-view .activity-card {
            display: flex;
            flex-direction: row;
            max-width: none;
            height: 200px;
        }

        .activities-grid.list-view .activity-image {
            width: 250px;
            height: 100%;
            flex-shrink: 0;
        }

        .activities-grid.list-view .activity-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        /* Compact View */
        .activities-grid.compact-view {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
        }

        .activities-grid.compact-view .activity-card {
            padding: 0;
        }

        .activities-grid.compact-view .activity-image {
            height: 120px;
        }

        .activities-grid.compact-view .activity-content {
            padding: 1rem;
        }

        .activities-grid.compact-view .activity-title {
            font-size: 1rem;
            margin-bottom: 0.5rem;
        }

        .activities-grid.compact-view .activity-description {
            font-size: 0.875rem;
            -webkit-line-clamp: 2;
            line-clamp: 2;
        }

        /* Sort Controls */
        .sort-controls {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1.5rem;
            justify-content: center;
            flex-wrap: wrap;
        }

        .sort-select {
            padding: 0.5rem 1rem;
            border: 2px solid var(--border);
            border-radius: 0.5rem;
            background: white;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .sort-select:focus {
            outline: none;
            border-color: var(--primary);
        }

        /* Activity Tags */
        .activity-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.25rem;
            margin-top: 0.5rem;
        }

        .activity-tag {
            padding: 0.125rem 0.5rem;
            background: var(--bg-secondary);
            color: var(--text-muted);
            border-radius: 1rem;
            font-size: 0.75rem;
            border: 1px solid var(--border);
        }

        /* Priority Indicators */
        .priority-indicator {
            position: absolute;
            top: 0.75rem;
            right: 0.75rem;
            width: 8px;
            height: 8px;
            border-radius: 50%;
        }

        .priority-high { background: var(--danger); }
        .priority-medium { background: var(--warning); }
        .priority-low { background: var(--success); }

        /* Featured Badge */
        .featured-badge {
            position: absolute;
            top: 0.75rem;
            left: 0.75rem;
            background: linear-gradient(45deg, #ffd700, #ffed4e);
            color: #92400e;
            padding: 0.25rem 0.5rem;
            border-radius: 1rem;
            font-size: 0.75rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 0.25rem;
            box-shadow: 0 2px 4px rgba(255, 215, 0, 0.3);
        }

        /* Statistics Cards Enhancement */
        .stat-card {
            position: relative;
            overflow: hidden;
        }

        .stat-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, var(--primary), var(--secondary));
        }

        .stat-card:hover::before {
            height: 4px;
        }

        /* Dark Mode Toggle */
        .theme-toggle {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: var(--primary);
            color: white;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
            transition: all 0.3s ease;
            z-index: 100;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.25rem;
        }

        .theme-toggle:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
        }

        /* Dark Mode Styles */
        [data-theme="dark"] {
            --bg-primary: #1f2937;
            --bg-secondary: #111827;
            --text-primary: #f9fafb;
            --text-secondary: #d1d5db;
            --text-muted: #9ca3af;
            --border: #374151;
        }

        [data-theme="dark"] .activity-card {
            background: var(--bg-primary);
            border-color: var(--border);
        }

        [data-theme="dark"] .filter-btn {
            background: var(--bg-primary);
            border-color: var(--border);
            color: var(--text-secondary);
        }

        /* Floating Action Button */
        .fab-container {
            position: fixed;
            bottom: 2rem;
            left: 2rem;
            z-index: 100;
        }

        .fab-main {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: var(--success);
            color: white;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.25rem;
        }

        .fab-main:hover {
            transform: scale(1.1) rotate(45deg);
        }

        .fab-menu {
            position: absolute;
            bottom: 70px;
            left: 0;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease;
            pointer-events: none;
        }

        .fab-container.active .fab-menu {
            opacity: 1;
            transform: translateY(0);
            pointer-events: all;
        }

        .fab-item {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: white;
            border: 2px solid var(--border);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            color: var(--text-primary);
        }

        .fab-item:hover {
            background: var(--primary);
            color: white;
            transform: scale(1.1);
        }

        /* Activity Card Enhancements */
        .activity-card {
            position: relative;
            overflow: hidden;
        }

        .activity-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, transparent, var(--primary), transparent);
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .activity-card:hover::before {
            opacity: 1;
        }

        .activity-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }

        /* Progress Bar for Loading */
        .progress-bar {
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: var(--primary);
            z-index: 1000;
            transition: width 0.3s ease;
            opacity: 0;
        }

        .progress-bar.active {
            opacity: 1;
        }

        /* Skeleton Loading */
        .skeleton {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: loading 1.5s infinite;
        }

        @keyframes loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }

        .skeleton-card {
            height: 300px;
            border-radius: var(--radius);
            margin-bottom: 1rem;
        }

        /* Activity Detail Modal */
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(5px);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            pointer-events: none;
        }

        .modal-overlay.active {
            opacity: 1;
            visibility: visible;
            pointer-events: auto;
        }

        .modal-content {
            background: var(--bg-primary);
            border-radius: var(--radius);
            max-width: 800px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
            transform: scale(0.7) translateY(50px);
            transition: all 0.3s ease;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
        }

        .modal-overlay.active .modal-content {
            transform: scale(1) translateY(0);
        }

        .modal-header {
            position: relative;
            padding: 0;
            border-radius: var(--radius) var(--radius) 0 0;
            overflow: hidden;
        }

        .modal-hero {
            height: 300px;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
        }

        .modal-hero img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .modal-hero-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7));
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            padding: 2rem;
            color: white;
        }

        .modal-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            transition: all 0.3s ease;
            z-index: 10;
        }

        .modal-close:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: scale(1.1);
        }

        .modal-title {
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }

        .modal-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            align-items: center;
            font-size: 0.9rem;
            opacity: 0.9;
        }

        .modal-meta-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            background: rgba(255, 255, 255, 0.2);
            padding: 0.25rem 0.75rem;
            border-radius: 1rem;
            backdrop-filter: blur(10px);
        }

        .modal-body {
            padding: 2rem;
        }

        .modal-section {
            margin-bottom: 2rem;
        }

        .modal-section:last-child {
            margin-bottom: 0;
        }

        .modal-section-title {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 1rem;
            color: var(--text-primary);
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .modal-description {
            font-size: 1rem;
            line-height: 1.7;
            color: var(--text-secondary);
            margin-bottom: 1.5rem;
        }

        .modal-details-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-bottom: 1.5rem;
        }

        .modal-detail-item {
            background: var(--bg-secondary);
            padding: 1rem;
            border-radius: 0.5rem;
            border: 1px solid var(--border);
        }

        .modal-detail-label {
            font-size: 0.875rem;
            color: var(--text-muted);
            margin-bottom: 0.25rem;
            font-weight: 500;
        }

        .modal-detail-value {
            font-size: 1rem;
            color: var(--text-primary);
            font-weight: 600;
        }

        .modal-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-top: 1rem;
        }

        .modal-tag {
            padding: 0.375rem 0.75rem;
            background: var(--primary);
            color: white;
            border-radius: 1rem;
            font-size: 0.875rem;
            font-weight: 500;
        }

        .modal-actions {
            display: flex;
            gap: 1rem;
            justify-content: flex-end;
            padding: 1.5rem 2rem;
            border-top: 1px solid var(--border);
            background: var(--bg-secondary);
        }

        .modal-btn {
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            text-decoration: none;
            border: none;
            font-size: 0.9rem;
        }

        .modal-btn-primary {
            background: var(--primary);
            color: white;
        }

        .modal-btn-primary:hover {
            background: var(--secondary);
            transform: translateY(-1px);
        }

        .modal-btn-secondary {
            background: var(--bg-primary);
            color: var(--text-primary);
            border: 2px solid var(--border);
        }

        .modal-btn-secondary:hover {
            border-color: var(--primary);
            color: var(--primary);
        }

        /* Activity Card View Button */
        .activity-view-btn {
            position: absolute;
            top: 1rem;
            right: 1rem;
            width: 35px;
            height: 35px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transform: scale(0.8);
            transition: all 0.3s ease;
            color: var(--text-primary);
            font-size: 0.9rem;
        }

        .activity-card:hover .activity-view-btn {
            opacity: 1;
            transform: scale(1);
        }

        .activity-view-btn:hover {
            background: white;
            transform: scale(1.1);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        /* Status Badge in Modal */
        .modal-status-badge {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            border-radius: 1rem;
            font-weight: 600;
            font-size: 0.875rem;
        }

        .modal-status-published {
            background: #d1fae5;
            color: #065f46;
        }

        .modal-status-draft {
            background: #fef3c7;
            color: #92400e;
        }

        /* Priority Badge in Modal */
        .modal-priority-badge {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            border-radius: 1rem;
            font-weight: 600;
            font-size: 0.875rem;
        }

        .modal-priority-high {
            background: #fee2e2;
            color: #dc2626;
        }

        .modal-priority-medium {
            background: #fef3c7;
            color: #d97706;
        }

        .modal-priority-low {
            background: #d1fae5;
            color: #059669;
        }

        /* Dark Mode for Modal */
        [data-theme="dark"] .modal-content {
            background: var(--bg-primary);
            border: 1px solid var(--border);
        }

        [data-theme="dark"] .modal-detail-item {
            background: var(--bg-secondary);
            border-color: var(--border);
        }

        [data-theme="dark"] .modal-actions {
            background: var(--bg-secondary);
            border-color: var(--border);
        }

        /* Enhanced Modal Sections */
        .participants-info {
            background: var(--bg-secondary);
            border-radius: var(--radius);
            padding: 1.5rem;
            border: 1px solid var(--border);
        }

        .participant-stats {
            display: flex;
            gap: 2rem;
            margin-bottom: 1rem;
        }

        .stat-item {
            text-align: center;
        }

        .stat-number {
            display: block;
            font-size: 2rem;
            font-weight: 700;
            color: var(--primary);
            line-height: 1;
        }

        .stat-label {
            font-size: 0.875rem;
            color: var(--text-muted);
            margin-top: 0.25rem;
        }

        .registration-status {
            text-align: center;
        }

        .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            border-radius: 1rem;
            font-size: 0.875rem;
            font-weight: 600;
        }

        .status-open {
            background: rgba(16, 185, 129, 0.1);
            color: #10b981;
            border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .status-closed {
            background: rgba(239, 68, 68, 0.1);
            color: #ef4444;
            border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .status-full {
            background: rgba(245, 158, 11, 0.1);
            color: #f59e0b;
            border: 1px solid rgba(245, 158, 11, 0.2);
        }

        .contact-info {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .contact-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            background: var(--bg-secondary);
            border-radius: var(--radius);
            border: 1px solid var(--border);
            transition: all 0.3s ease;
        }

        .contact-item:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .contact-item i {
            width: 20px;
            text-align: center;
            color: var(--primary);
            font-size: 1.125rem;
        }

        .contact-details {
            flex: 1;
        }

        .contact-label {
            font-size: 0.875rem;
            color: var(--text-muted);
            margin-bottom: 0.25rem;
        }

        .contact-value {
            font-weight: 500;
            color: var(--text-primary);
        }

        .attachments-list {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
        }

        .attachment-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            background: var(--bg-secondary);
            border-radius: var(--radius);
            border: 1px solid var(--border);
            transition: all 0.3s ease;
            cursor: pointer;
        }

        .attachment-item:hover {
            background: rgba(37, 99, 235, 0.05);
            border-color: var(--primary);
        }

        .attachment-icon {
            width: 40px;
            height: 40px;
            border-radius: 0.5rem;
            background: var(--primary);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.125rem;
        }

        .attachment-info {
            flex: 1;
        }

        .attachment-name {
            font-weight: 500;
            color: var(--text-primary);
            margin-bottom: 0.25rem;
        }

        .attachment-size {
            font-size: 0.875rem;
            color: var(--text-muted);
        }

        .related-activities {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
        }

        .related-activity-card {
            background: var(--bg-secondary);
            border-radius: var(--radius);
            border: 1px solid var(--border);
            padding: 1rem;
            transition: all 0.3s ease;
            cursor: pointer;
        }

        .related-activity-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            border-color: var(--primary);
        }

        .related-activity-title {
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 0.5rem;
            font-size: 0.9rem;
        }

        .related-activity-date {
            font-size: 0.8rem;
            color: var(--text-muted);
        }

        /* Enhanced Modal Buttons */
        .modal-btn-success {
            background: #10b981;
            border-color: #10b981;
            color: white;
        }

        .modal-btn-success:hover {
            background: #059669;
            border-color: #059669;
            transform: translateY(-1px);
        }

        /* Dark Mode for Enhanced Sections */
        [data-theme="dark"] .participants-info,
        [data-theme="dark"] .contact-item,
        [data-theme="dark"] .attachment-item,
        [data-theme="dark"] .related-activity-card {
            background: var(--bg-secondary);
            border-color: var(--border);
        }

        /* Advanced Filter Section */
        .advanced-filter-section {
            background: var(--bg-primary);
            border-radius: var(--radius);
            padding: 1.5rem;
            margin-bottom: 2rem;
            box-shadow: var(--shadow);
            border: 1px solid var(--border);
        }

        .filter-tabs-container {
            margin-bottom: 1.5rem;
        }

        .filter-tabs-wrapper {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
            justify-content: center;
        }

        .filter-tab {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1.25rem;
            background: var(--bg-secondary);
            border: 2px solid var(--border);
            border-radius: 2rem;
            color: var(--text-secondary);
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 0.9rem;
            white-space: nowrap;
        }

        .filter-tab i {
            font-size: 1rem;
        }

        .filter-count {
            font-size: 0.85rem;
            opacity: 0.8;
        }

        .filter-tab.active .filter-count {
            opacity: 1;
        }

        .search-filter-container {
            display: flex;
            justify-content: center;
        }

        .search-input-wrapper {
            position: relative;
            max-width: 400px;
            width: 100%;
        }

        .search-input {
            width: 100%;
            padding: 0.875rem 3rem 0.875rem 3rem;
            border: 2px solid var(--border);
            border-radius: 2rem;
            font-size: 1rem;
            background: var(--bg-primary);
            color: var(--text-primary);
            transition: all 0.3s ease;
            outline: none;
        }

        .search-input:focus {
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
            background: white;
        }

        .search-input::placeholder {
            color: var(--text-muted);
        }

        .search-icon {
            position: absolute;
            left: 1rem;
            top: 50%;
            transform: translateY(-50%);
            color: var(--text-muted);
            font-size: 1rem;
            pointer-events: none;
        }

        .clear-search-btn {
            position: absolute;
            right: 0.75rem;
            top: 50%;
            transform: translateY(-50%);
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: var(--bg-secondary);
            border: 1px solid var(--border);
            color: var(--text-muted);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            font-size: 0.875rem;
        }

        .clear-search-btn:hover {
            background: var(--danger);
            color: white;
            border-color: var(--danger);
            transform: translateY(-50%) scale(1.1);
        }

        /* Filter Animation */
        .filter-tab {
            position: relative;
            overflow: hidden;
        }

        .filter-tab::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.5s ease;
        }

        .filter-tab:hover::before {
            left: 100%;
        }

        .filter-tab.active::before {
            display: none;
        }

        /* Featured Filter Special Styling */
        .filter-featured {
            background: linear-gradient(135deg, #fbbf24, #f59e0b);
            color: white;
            border-color: #f59e0b;
            position: relative;
            overflow: hidden;
        }

        .filter-featured:hover {
            background: linear-gradient(135deg, #f59e0b, #d97706);
            border-color: #d97706;
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4);
        }

        .filter-featured.active {
            background: linear-gradient(135deg, #d97706, #b45309);
            border-color: #b45309;
            color: white;
            box-shadow: 0 8px 25px rgba(245, 158, 11, 0.5);
        }

        .filter-featured i {
            animation: starTwinkle 2s infinite;
        }

        @keyframes starTwinkle {
            0%, 100% { transform: scale(1) rotate(0deg); }
            25% { transform: scale(1.1) rotate(5deg); }
            50% { transform: scale(1.2) rotate(0deg); }
            75% { transform: scale(1.1) rotate(-5deg); }
        }

        .filter-featured::after {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
            transform: rotate(45deg);
            animation: featuredShine 3s infinite;
        }

        @keyframes featuredShine {
            0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
            50% { transform: translateX(0%) translateY(0%) rotate(45deg); }
            100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
        }

        .filter-featured.has-items {
            animation: featuredGlow 2s infinite alternate;
        }

        @keyframes featuredGlow {
            0% { box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3); }
            100% { box-shadow: 0 8px 25px rgba(245, 158, 11, 0.6); }
        }

        .filter-featured.has-items .filter-count {
            animation: countPulse 1.5s infinite;
        }

        @keyframes countPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); font-weight: 700; }
        }

        /* Search Input Animation */
        .search-input-wrapper::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            width: 0;
            height: 2px;
            background: var(--primary);
            transition: all 0.3s ease;
            transform: translateX(-50%);
        }

        .search-input:focus + .search-icon + .clear-search-btn + ::after,
        .search-input-wrapper:focus-within::after {
            width: 100%;
        }

        /* Dark Mode for Advanced Filter */
        [data-theme="dark"] .advanced-filter-section {
            background: var(--bg-primary);
            border-color: var(--border);
        }

        [data-theme="dark"] .filter-tab {
            background: var(--bg-secondary);
            border-color: var(--border);
            color: var(--text-secondary);
        }

        [data-theme="dark"] .filter-tab:hover {
            background: rgba(37, 99, 235, 0.1);
        }

        [data-theme="dark"] .search-input {
            background: var(--bg-secondary);
            border-color: var(--border);
            color: var(--text-primary);
        }

        [data-theme="dark"] .search-input:focus {
            background: var(--bg-primary);
        }

        [data-theme="dark"] .clear-search-btn {
            background: var(--bg-primary);
            border-color: var(--border);
        }


        /* Statistics Dashboard */
        .statistics-modal {
            max-width: 1000px;
            width: 95%;
        }

        .stats-overview {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-bottom: 2rem;
        }

        .stat-card {
            background: var(--bg-secondary);
            border: 1px solid var(--border);
            border-radius: var(--radius);
            padding: 1.5rem;
            display: flex;
            align-items: center;
            gap: 1rem;
            transition: all 0.3s ease;
        }

        .stat-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .stat-icon {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.5rem;
        }

        .stat-content {
            flex: 1;
        }

        .stat-number {
            font-size: 2rem;
            font-weight: 700;
            color: var(--text-primary);
            line-height: 1;
        }

        .stat-label {
            font-size: 0.875rem;
            color: var(--text-muted);
            margin-top: 0.25rem;
        }

        .stats-charts {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            margin-bottom: 2rem;
        }

        .chart-container {
            background: var(--bg-secondary);
            border: 1px solid var(--border);
            border-radius: var(--radius);
            padding: 1.5rem;
        }

        .chart-container h3 {
            margin: 0 0 1rem 0;
            color: var(--text-primary);
            font-size: 1.125rem;
        }

        .chart-placeholder {
            display: flex;
            align-items: end;
            justify-content: space-around;
            height: 200px;
            background: var(--bg-primary);
            border-radius: 0.5rem;
            padding: 1rem;
            position: relative;
        }

        .chart-bar {
            background: linear-gradient(to top, var(--primary), var(--secondary));
            border-radius: 0.25rem 0.25rem 0 0;
            width: 60px;
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: end;
            align-items: center;
            transition: all 0.3s ease;
        }

        .chart-bar:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 8px rgba(37, 99, 235, 0.3);
        }

        .chart-bar span {
            position: absolute;
            bottom: -1.5rem;
            font-size: 0.75rem;
            color: var(--text-muted);
            text-align: center;
            white-space: nowrap;
        }

        .bar-value {
            position: absolute;
            top: -1.5rem;
            font-size: 0.875rem;
            font-weight: 600;
            color: var(--text-primary);
            text-align: center;
        }

        .trend-chart {
            height: 200px;
            background: var(--bg-primary);
            border-radius: 0.5rem;
            position: relative;
            overflow: hidden;
        }

        .trend-line {
            position: relative;
            width: 100%;
            height: 100%;
        }

        .trend-point {
            position: absolute;
            width: 12px;
            height: 12px;
            background: var(--primary);
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            animation: trendPulse 2s infinite;
        }

        .trend-point::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 100%;
            width: 80px;
            height: 2px;
            background: linear-gradient(to right, var(--primary), transparent);
            transform: translateY(-50%);
        }

        .trend-point:last-child::before {
            display: none;
        }

        @keyframes trendPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
        }

        .stats-details {
            background: var(--bg-secondary);
            border: 1px solid var(--border);
            border-radius: var(--radius);
            padding: 1.5rem;
        }

        .stats-details h3 {
            margin: 0 0 1rem 0;
            color: var(--text-primary);
            font-size: 1.125rem;
        }

        .stats-table {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
        }

        .stats-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.75rem 0;
            border-bottom: 1px solid var(--border);
        }

        .stats-row:last-child {
            border-bottom: none;
        }

        .stats-row span:first-child {
            color: var(--text-secondary);
            font-weight: 500;
        }

        .stats-row span:last-child {
            color: var(--text-primary);
            font-weight: 600;
        }

        /* Dark Mode for Statistics */
        [data-theme="dark"] .stat-card {
            background: var(--bg-secondary);
            border-color: var(--border);
        }

        [data-theme="dark"] .chart-container {
            background: var(--bg-secondary);
            border-color: var(--border);
        }

        [data-theme="dark"] .chart-placeholder {
            background: var(--bg-primary);
        }

        [data-theme="dark"] .trend-chart {
            background: var(--bg-primary);
        }

        [data-theme="dark"] .stats-details {
            background: var(--bg-secondary);
            border-color: var(--border);
        }

        /* Responsive Enhancements */
        @media (max-width: 768px) {
            .activities-grid.list-view .activity-card {
                flex-direction: column;
                height: auto;
            }
            
            .activities-grid.list-view .activity-image {
                width: 100%;
                height: 200px;
            }
            
            .sort-controls {
                flex-direction: column;
                align-items: stretch;
            }
            
            .view-toggle {
                order: -1;
            }
            
            .fab-container {
                bottom: 1rem;
                left: 1rem;
            }
            
            .theme-toggle {
                bottom: 1rem;
                right: 1rem;
            }
            
            .modal-content {
                width: 95%;
                max-height: 95vh;
            }
            
            .modal-hero {
                height: 200px;
            }
            
            .modal-title {
                font-size: 1.5rem;
            }
            
            .modal-body {
                padding: 1.5rem;
            }
            
            .modal-actions {
                padding: 1rem 1.5rem;
                flex-direction: column;
            }
            
            .modal-btn {
                width: 100%;
                justify-content: center;
            }
            
            .modal-details-grid {
                grid-template-columns: 1fr;
            }
            
            .advanced-filter-section {
                padding: 1rem;
                margin-bottom: 1.5rem;
            }
            
            .filter-tabs-wrapper {
                justify-content: flex-start;
                overflow-x: auto;
                padding-bottom: 0.5rem;
                scrollbar-width: thin;
            }
            
            .filter-tabs-wrapper::-webkit-scrollbar {
                height: 4px;
            }
            
            .filter-tabs-wrapper::-webkit-scrollbar-track {
                background: var(--bg-secondary);
                border-radius: 2px;
            }
            
            .filter-tabs-wrapper::-webkit-scrollbar-thumb {
                background: var(--primary);
                border-radius: 2px;
            }
            
            .filter-tab {
                flex-shrink: 0;
                padding: 0.625rem 1rem;
                font-size: 0.85rem;
            }
            
            .filter-tab span:not(.filter-count) {
                display: none;
            }
            
            .filter-tab i {
                margin-right: 0;
            }
            
            .filter-featured {
                background: linear-gradient(135deg, #fbbf24, #f59e0b);
                color: white;
            }
            
            .filter-featured.active {
                background: linear-gradient(135deg, #d97706, #b45309);
            }
            
            .search-input-wrapper {
                max-width: 100%;
            }
            
            .search-input {
                padding: 0.75rem 2.5rem 0.75rem 2.5rem;
                font-size: 0.9rem;
            }
            
            .statistics-modal {
                width: 98%;
                max-height: 95vh;
            }
            
            .stats-overview {
                grid-template-columns: 1fr 1fr;
                gap: 0.75rem;
            }
            
            .stat-card {
                padding: 1rem;
                flex-direction: column;
                text-align: center;
            }
            
            .stat-icon {
                width: 50px;
                height: 50px;
                font-size: 1.25rem;
            }
            
            .stat-number {
                font-size: 1.5rem;
            }
            
            .stats-charts {
                grid-template-columns: 1fr;
                gap: 1rem;
            }
            
            .chart-container {
                padding: 1rem;
            }
            
            .chart-placeholder {
                height: 150px;
                padding: 0.5rem;
            }
            
            .chart-bar {
                width: 40px;
            }
            
            .stats-row {
                flex-direction: column;
                align-items: flex-start;
                gap: 0.25rem;
            }
        }

        /* Error Message */
        .error-message {
            background: #fef2f2;
            border: 1px solid #fecaca;
            color: #dc2626;
            padding: 1rem;
            border-radius: var(--radius);
            margin: 2rem 0;
            text-align: center;
        }

        /* Loading State */
        .loading {
            text-align: center;
            padding: 3rem;
            color: var(--text-muted);
        }

        .loading i {
            font-size: 2rem;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        /* Responsive */
        @media (max-width: 768px) {
            .hero-title {
                font-size: 2rem;
            }
            
            .activities-grid {
                grid-template-columns: 1fr;
            }
            
            .filter-tabs {
                flex-direction: column;
                align-items: center;
            }
        }

        /* Footer */
        .activities-footer {
            background: var(--text-primary);
            color: white;
            padding: 2rem 0;
            text-align: center;
            margin-top: 3rem;
        }

        .footer-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 1rem;
        }

        .footer-links {
            display: flex;
            gap: 2rem;
        }

        .footer-links a {
            color: rgba(255,255,255,0.8);
            text-decoration: none;
            transition: 0.3s ease;
        }

        .footer-links a:hover {
            color: white;
        }
    </style>
</head>
<body>
    <%
    // Database connection and data loading
    string connectionString = "";
    string errorMessage = "";
    int totalActivities = 0;
    int totalEvents = 0;
    int totalTraining = 0;
    int totalNews = 0;
    int totalMeetings = 0;
    int ongoingActivities = 0;
    int upcomingActivities = 0;
    DataTable activitiesData = new DataTable();
    string currentFilter = Request.QueryString["filter"] ?? "all";
    string searchQuery = Request.QueryString["search"] ?? "";

    try 
    {
        // Get connection string
        var connStr = ConfigurationManager.ConnectionStrings["DefaultConnection"];
        if (connStr == null)
        {
            // Try alternative connection string names
            connStr = ConfigurationManager.ConnectionStrings["WebsiteActivitiesDB"] ?? 
                     ConfigurationManager.ConnectionStrings["LocalSqlServer"];
        }
        
        if (connStr != null)
        {
            connectionString = connStr.ConnectionString;
            
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                
                // Check if Activities table exists
                string checkTableQuery = @"
                    SELECT COUNT(*) 
                    FROM INFORMATION_SCHEMA.TABLES 
                    WHERE TABLE_NAME = 'Activities'";
                
                using (SqlCommand cmd = new SqlCommand(checkTableQuery, conn))
                {
                    int tableExists = (int)cmd.ExecuteScalar();
                    
                    if (tableExists > 0)
                    {
                        // Build dynamic query based on filter and search
                        string baseQuery = "SELECT * FROM Activities WHERE 1=1";
                        string whereClause = "";
                        
                        // Add filter condition
                        if (currentFilter != "all")
                        {
                            switch (currentFilter.ToLower())
                            {
                                case "events":
                                    whereClause += " AND (ActivityType LIKE '%event%' OR ActivityType LIKE '%sự kiện%')";
                                    break;
                                case "training":
                                    whereClause += " AND (ActivityType LIKE '%training%' OR ActivityType LIKE '%đào tạo%' OR ActivityType LIKE '%workshop%')";
                                    break;
                                case "news":
                                    whereClause += " AND (ActivityType LIKE '%news%' OR ActivityType LIKE '%tin tức%' OR ActivityType LIKE '%thông báo%')";
                                    break;
                                case "meetings":
                                    whereClause += " AND (ActivityType LIKE '%meeting%' OR ActivityType LIKE '%họp%' OR ActivityType LIKE '%conference%')";
                                    break;
                                case "featured":
                                    // Simple fallback for featured - use recent activities
                                    whereClause += " AND CreatedDate >= DATEADD(month, -1, GETDATE())";
                                    break;
                            }
                        }
                        
                        // Add search condition
                        if (!string.IsNullOrEmpty(searchQuery))
                        {
                            whereClause += " AND (Title LIKE @search OR Description LIKE @search OR Location LIKE @search)";
                        }
                        
                        string finalQuery = baseQuery + whereClause + " ORDER BY CreatedDate DESC";
                        
                        using (SqlCommand cmd2 = new SqlCommand(finalQuery, conn))
                        {
                            if (!string.IsNullOrEmpty(searchQuery))
                            {
                                cmd2.Parameters.AddWithValue("@search", "%" + searchQuery + "%");
                            }
                            
                            SqlDataAdapter adapter = new SqlDataAdapter(cmd2);
                            adapter.Fill(activitiesData);
                        }
                        
                        // Get statistics for each category
                        using (SqlCommand cmd3 = new SqlCommand("SELECT COUNT(*) FROM Activities", conn))
                        {
                            totalActivities = (int)cmd3.ExecuteScalar();
                        }
                        
                        using (SqlCommand cmd4 = new SqlCommand("SELECT COUNT(*) FROM Activities WHERE (ActivityType LIKE '%event%' OR ActivityType LIKE '%sự kiện%')", conn))
                        {
                            totalEvents = (int)cmd4.ExecuteScalar();
                        }
                        
                        using (SqlCommand cmd5 = new SqlCommand("SELECT COUNT(*) FROM Activities WHERE (ActivityType LIKE '%training%' OR ActivityType LIKE '%đào tạo%' OR ActivityType LIKE '%workshop%')", conn))
                        {
                            totalTraining = (int)cmd5.ExecuteScalar();
                        }
                        
                        using (SqlCommand cmd6 = new SqlCommand("SELECT COUNT(*) FROM Activities WHERE (ActivityType LIKE '%news%' OR ActivityType LIKE '%tin tức%' OR ActivityType LIKE '%thông báo%')", conn))
                        {
                            totalNews = (int)cmd6.ExecuteScalar();
                        }
                        
                        using (SqlCommand cmd7 = new SqlCommand("SELECT COUNT(*) FROM Activities WHERE (ActivityType LIKE '%meeting%' OR ActivityType LIKE '%họp%' OR ActivityType LIKE '%conference%')", conn))
                        {
                            totalMeetings = (int)cmd7.ExecuteScalar();
                        }
                        
                        // Try to get published activities count (fallback if column doesn't exist)
                        try
                        {
                            using (SqlCommand cmd8 = new SqlCommand("SELECT COUNT(*) FROM Activities WHERE IsPublished = 1", conn))
                            {
                                upcomingActivities = (int)cmd8.ExecuteScalar();
                            }
                        }
                        catch
                        {
                            upcomingActivities = totalActivities; // Fallback to total if IsPublished column doesn't exist
                        }
                        
                        // Get featured activities count (recent activities as featured)
                        using (SqlCommand cmd9 = new SqlCommand("SELECT COUNT(*) FROM Activities WHERE CreatedDate >= DATEADD(month, -1, GETDATE())", conn))
                        {
                            ongoingActivities = (int)cmd9.ExecuteScalar();
                        }
                    }
                    else
                    {
                        errorMessage = "Bảng Activities chưa tồn tại trong database. Vui lòng chạy script tạo database trước.";
                    }
                }
            }
        }
        else
        {
            errorMessage = "Không tìm thấy connection string trong Web.config. Vui lòng cấu hình connection string.";
        }
    }
    catch (SqlException sqlEx)
    {
        if (sqlEx.Message.Contains("Invalid column name"))
        {
            errorMessage = "Lỗi cấu trúc database: " + sqlEx.Message + 
                          "\n\nHướng dẫn khắc phục:" +
                          "\n- Chạy script tạo database: Database/RunAllScripts.sql" +
                          "\n- Cập nhật cấu trúc bảng Activities" +
                          "\n- Đảm bảo tất cả cột cần thiết đã được tạo";
        }
        else
        {
            errorMessage = "Lỗi SQL: " + sqlEx.Message + 
                          "\n\nHướng dẫn khắc phục:" +
                          "\n- Kiểm tra connection string trong Web.config" +
                          "\n- Đảm bảo SQL Server đang chạy" +
                          "\n- Kiểm tra quyền truy cập database";
        }
    }
    catch (Exception ex)
    {
        errorMessage = "Lỗi kết nối database: " + ex.Message + 
                      "\n\nHướng dẫn khắc phục:" +
                      "\n- Chạy script tạo database: Database/RunAllScripts.sql" +
                      "\n- Cập nhật connection string trong Web.config" +
                      "\n- Đảm bảo SQL Server đang chạy";
    }
    %>


    <!-- Activities Section -->
    <section class="activities-section">
        <div class="container">
            <!-- Progress Bar -->
            <div class="progress-bar" id="progressBar"></div>
            
            <!-- View Toggle and Sort Controls -->
            
            <!-- Advanced Filter Section -->
            <div class="advanced-filter-section">
                <div class="filter-tabs-container">
                    <div class="filter-tabs-wrapper">
                        <button class="filter-tab active" data-filter="all">
                            <i class="fas fa-th-large"></i>
                            <span>Tất cả</span>
                            <span class="filter-count">(<%= totalActivities %>)</span>
                        </button>
                        <button class="filter-tab" data-filter="events">
                            <i class="fas fa-calendar-alt"></i>
                            <span>Sự kiện</span>
                            <span class="filter-count" id="eventsCount">(0)</span>
                        </button>
                        <button class="filter-tab" data-filter="training">
                            <i class="fas fa-graduation-cap"></i>
                            <span>Đào tạo</span>
                            <span class="filter-count" id="trainingCount">(0)</span>
                        </button>
                        <button class="filter-tab" data-filter="news">
                            <i class="fas fa-newspaper"></i>
                            <span>Tin tức</span>
                            <span class="filter-count" id="newsCount">(0)</span>
                        </button>
                        <button class="filter-tab" data-filter="meetings">
                            <i class="fas fa-users"></i>
                            <span>Họp</span>
                            <span class="filter-count" id="meetingsCount">(0)</span>
                        </button>
                        <button class="filter-tab filter-featured" data-filter="featured">
                            <i class="fas fa-star"></i>
                            <span>Nổi bật</span>
                            <span class="filter-count" id="featuredCount">(0)</span>
                        </button>
                    </div>
                </div>
                
                <div class="search-filter-container">
                    <div class="search-input-wrapper">
                        <i class="fas fa-search search-icon"></i>
                        <input type="text" id="advancedSearchInput" placeholder="Tìm kiếm hoạt động..." class="search-input">
                        <button type="button" id="clearAdvancedSearch" class="clear-search-btn" style="display: none;">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            </div>
            

            <div class="sort-controls">
                <select class="sort-select" id="sortBy">
                    <option value="date">Sắp xếp theo ngày</option>
                    <option value="title">Sắp xếp theo tên</option>
                    <option value="type">Sắp xếp theo loại</option>
                    <option value="featured">Nổi bật trước</option>
                </select>
                
                <select class="sort-select" id="sortOrder">
                    <option value="desc">Mới nhất</option>
                    <option value="asc">Cũ nhất</option>
                </select>
                
                <button class="sort-select" onclick="showSkeletonLoading()">
                    <i class="fas fa-sync-alt"></i>
                    Làm mới
                </button>
            </div>
            <% if (!string.IsNullOrEmpty(errorMessage)) { %>
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <%= errorMessage %>
                    <br><br>
                    <strong>Hướng dẫn khắc phục:</strong>
                    <ol style="text-align: left; margin-top: 1rem; max-width: 600px; margin-left: auto; margin-right: auto;">
                        <li>Chạy script tạo database: <code>Database/RunAllScripts.sql</code></li>
                        <li>Cập nhật connection string trong Web.config</li>
                        <li>Đảm bảo SQL Server đang chạy</li>
                    </ol>
                </div>
            <% } else if (activitiesData.Rows.Count == 0) { %>
                <div class="error-message">
                    <i class="fas fa-info-circle"></i>
                    Chưa có hoạt động nào được tạo. Vui lòng thêm dữ liệu vào database hoặc truy cập trang Admin để tạo hoạt động mới.
                </div>
            <% } else { %>
                <div class="activities-grid grid-view" id="activitiesGrid">
                    <%
                    string filterType = Request.QueryString["filter"];
                    foreach (DataRow row in activitiesData.Rows)
                    {
                        string activityType = row["ActivityType"].ToString();
                        
                        // Apply filter
                        if (!string.IsNullOrEmpty(filterType) && filterType != "all" && activityType != filterType)
                            continue;
                            
                        string title = row["Title"].ToString();
                        string description = row["Description"] != DBNull.Value ? row["Description"].ToString() : "";
                        string type = row["ActivityType"].ToString();
                        DateTime date = row["CreatedDate"] != DBNull.Value ? Convert.ToDateTime(row["CreatedDate"]) : DateTime.Now;
                        string time = "";
                        string location = row["Location"] != DBNull.Value ? row["Location"].ToString() : "";
                        string image = row["ImageUrl"] != DBNull.Value ? row["ImageUrl"].ToString() : "";
                        string status = row["IsPublished"] != DBNull.Value && Convert.ToBoolean(row["IsPublished"]) ? "published" : "draft";
                        string priority = "normal";
                        bool isFeatured = row["IsFeatured"] != DBNull.Value && Convert.ToBoolean(row["IsFeatured"]);
                        string tags = "";
                        
                        // Get type info
                        string typeClass = "type-" + type;
                        string typeLabel = "";
                        string typeIcon = "";
                        
                        switch (type)
                        {
                            case "event":
                                typeLabel = "Sự kiện";
                                typeIcon = "fas fa-calendar-alt";
                                break;
                            case "activity":
                                typeLabel = "Hoạt động";
                                typeIcon = "fas fa-tasks";
                                break;
                            case "notification":
                                typeLabel = "Thông báo";
                                typeIcon = "fas fa-bell";
                                break;
                            case "schedule":
                                typeLabel = "Lịch trình";
                                typeIcon = "fas fa-clock";
                                break;
                            default:
                                typeLabel = type;
                                typeIcon = "fas fa-info-circle";
                                break;
                        }
                        
                        // Get status info
                        string statusClass = "status-" + status;
                        string statusLabel = "";
                        
                        switch (status)
                        {
                            case "published":
                                statusLabel = "Đã xuất bản";
                                break;
                            case "draft":
                                statusLabel = "Bản nháp";
                                break;
                            default:
                                statusLabel = status;
                                break;
                        }
                        
                        // Truncate description
                        if (description.Length > 150)
                        {
                            description = description.Substring(0, 150) + "...";
                        }
                    %>
                        <div class="activity-card" data-type="<%= type %>" data-date="<%= date.ToString("yyyy-MM-dd") %>" data-featured="<%= isFeatured.ToString().ToLower() %>">
                            <% if (isFeatured) { %>
                                <div class="featured-badge">
                                    <i class="fas fa-star"></i>
                                    Nổi bật
                                </div>
                            <% } %>
                            
                            <div class="priority-indicator priority-<%= priority %>"></div>
                            
                            <button class="activity-view-btn" data-activity-id="<%= row["ActivityID"] %>" onclick="openActivityModal(this.dataset.activityId)" title="Xem chi tiết">
                                <i class="fas fa-eye"></i>
                            </button>
                            
                            <div class="activity-image">
                                <% if (!string.IsNullOrEmpty(image)) { %>
                                    <img src="<%= image %>" alt="<%= title %>" />
                                <% } else { %>
                                    <i class="<%= typeIcon %>"></i>
                                <% } %>
                            </div>
                            <div class="activity-content">
                                <div class="activity-meta">
                                    <span class="activity-type <%= typeClass %>">
                                        <i class="<%= typeIcon %>"></i>
                                        <%= typeLabel %>
                                    </span>
                                    <% if (isFeatured) { %>
                                        <span style="color: #f59e0b;">
                                            <i class="fas fa-star"></i>
                                            Nổi bật
                                        </span>
                                    <% } %>
                                </div>
                                <h3 class="activity-title"><%= title %></h3>
                                <p class="activity-description"><%= description %></p>
                                <div class="activity-footer">
                                    <div class="activity-date">
                                        <i class="fas fa-calendar"></i>
                                        <%= date.ToString("dd/MM/yyyy") %>
                                        <% if (!string.IsNullOrEmpty(time)) { %>
                                            <i class="fas fa-clock" style="margin-left: 0.5rem;"></i>
                                            <%= time %>
                                        <% } %>
                                    </div>
                                    <span class="activity-status <%= statusClass %>">
                                        <%= statusLabel %>
                                    </span>
                                </div>
                                <% if (!string.IsNullOrEmpty(location)) { %>
                                    <div style="margin-top: 0.5rem; color: var(--text-muted); font-size: 0.875rem;" data-location="<%= location %>">
                                        <i class="fas fa-map-marker-alt"></i>
                                        <%= location %>
                                    </div>
                                <% } %>
                                
                                <% if (!string.IsNullOrEmpty(tags)) { %>
                                    <div class="activity-tags">
                                        <%
                                        string[] tagArray = tags.Split(',');
                                        foreach (string tag in tagArray)
                                        {
                                            if (!string.IsNullOrWhiteSpace(tag))
                                            {
                                        %>
                                            <span class="activity-tag"><%= tag.Trim() %></span>
                                        <%
                                            }
                                        }
                                        %>
                                    </div>
                                <% } %>
                            </div>
                        </div>
                    <% } %>
                </div>
            <% } %>
        </div>
    </section>

    <!-- Activity Detail Modal -->
    <div class="modal-overlay" id="activityModal">
        <div class="modal-content">
            <div class="modal-header">
                <div class="modal-hero" id="modalHero">
                    <div class="modal-hero-overlay">
                        <h2 class="modal-title" id="modalTitle">Tiêu đề hoạt động</h2>
                        <div class="modal-meta" id="modalMeta">
                            <div class="modal-meta-item">
                                <i class="fas fa-calendar"></i>
                                <span id="modalDate">01/01/2025</span>
                            </div>
                            <div class="modal-meta-item">
                                <i class="fas fa-clock"></i>
                                <span id="modalTime">08:00</span>
                            </div>
                            <div class="modal-meta-item">
                                <i class="fas fa-map-marker-alt"></i>
                                <span id="modalLocation">Địa điểm</span>
                            </div>
                        </div>
                    </div>
                </div>
                <button class="modal-close" onclick="closeActivityModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="modal-body">
                <div class="modal-section">
                    <h3 class="modal-section-title">
                        <i class="fas fa-info-circle"></i>
                        Mô tả chi tiết
                    </h3>
                    <div class="modal-description" id="modalDescription">
                        Mô tả hoạt động sẽ được hiển thị ở đây...
                    </div>
                </div>
                
                <div class="modal-section">
                    <h3 class="modal-section-title">
                        <i class="fas fa-list"></i>
                        Thông tin chi tiết
                    </h3>
                    <div class="modal-details-grid">
                        <div class="modal-detail-item">
                            <div class="modal-detail-label">Loại hoạt động</div>
                            <div class="modal-detail-value" id="modalType">Sự kiện</div>
                        </div>
                        <div class="modal-detail-item">
                            <div class="modal-detail-label">Trạng thái</div>
                            <div class="modal-detail-value">
                                <span class="modal-status-badge" id="modalStatus">Đã xuất bản</span>
                            </div>
                        </div>
                        <div class="modal-detail-item">
                            <div class="modal-detail-label">Mức ưu tiên</div>
                            <div class="modal-detail-value">
                                <span class="modal-priority-badge" id="modalPriority">Bình thường</span>
                            </div>
                        </div>
                        <div class="modal-detail-item">
                            <div class="modal-detail-label">Lượt xem</div>
                            <div class="modal-detail-value" id="modalViews">0</div>
                        </div>
                        <div class="modal-detail-item">
                            <div class="modal-detail-label">Ngày tạo</div>
                            <div class="modal-detail-value" id="modalCreated">01/01/2025</div>
                        </div>
                        <div class="modal-detail-item">
                            <div class="modal-detail-label">Cập nhật lần cuối</div>
                            <div class="modal-detail-value" id="modalUpdated">01/01/2025</div>
                        </div>
                    </div>
                </div>
                
                <div class="modal-section" id="modalTagsSection" style="display: none;">
                    <h3 class="modal-section-title">
                        <i class="fas fa-tags"></i>
                        Từ khóa
                    </h3>
                    <div class="modal-tags" id="modalTags">
                        <!-- Tags will be populated here -->
                    </div>
                </div>
                
                <div class="modal-section" id="modalNotesSection" style="display: none;">
                    <h3 class="modal-section-title">
                        <i class="fas fa-sticky-note"></i>
                        Ghi chú
                    </h3>
                    <div class="modal-description" id="modalNotes">
                        <!-- Notes will be populated here -->
                    </div>
                </div>
                
                <!-- New Enhanced Sections -->
                <div class="modal-section" id="modalParticipantsSection">
                    <h3 class="modal-section-title">
                        <i class="fas fa-users"></i>
                        Người tham gia
                    </h3>
                    <div class="participants-info">
                        <div class="participant-stats">
                            <div class="stat-item">
                                <span class="stat-number" id="modalParticipantCount">0</span>
                                <span class="stat-label">Đã đăng ký</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-number" id="modalMaxParticipants">∞</span>
                                <span class="stat-label">Tối đa</span>
                            </div>
                        </div>
                        <div class="registration-status" id="modalRegistrationStatus">
                            <span class="status-badge status-open">Đang mở đăng ký</span>
                        </div>
                    </div>
                </div>
                
                <div class="modal-section" id="modalContactSection">
                    <h3 class="modal-section-title">
                        <i class="fas fa-address-book"></i>
                        Thông tin liên hệ
                    </h3>
                    <div class="contact-info">
                        <div class="contact-item">
                            <i class="fas fa-user"></i>
                            <div class="contact-details">
                                <div class="contact-label">Người phụ trách</div>
                                <div class="contact-value" id="modalContactPerson">Chưa cập nhật</div>
                            </div>
                        </div>
                        <div class="contact-item">
                            <i class="fas fa-phone"></i>
                            <div class="contact-details">
                                <div class="contact-label">Số điện thoại</div>
                                <div class="contact-value" id="modalContactPhone">Chưa cập nhật</div>
                            </div>
                        </div>
                        <div class="contact-item">
                            <i class="fas fa-envelope"></i>
                            <div class="contact-details">
                                <div class="contact-label">Email</div>
                                <div class="contact-value" id="modalContactEmail">Chưa cập nhật</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="modal-section" id="modalAttachmentsSection" style="display: none;">
                    <h3 class="modal-section-title">
                        <i class="fas fa-paperclip"></i>
                        Tài liệu đính kèm
                    </h3>
                    <div class="attachments-list" id="modalAttachments">
                        <!-- Attachments will be populated here -->
                    </div>
                </div>
                
                <div class="modal-section" id="modalRelatedSection" style="display: none;">
                    <h3 class="modal-section-title">
                        <i class="fas fa-link"></i>
                        Hoạt động liên quan
                    </h3>
                    <div class="related-activities" id="modalRelatedActivities">
                        <!-- Related activities will be populated here -->
                    </div>
                </div>
            </div>
            
            <div class="modal-actions">
                <button class="modal-btn modal-btn-success" onclick="registerActivity()" id="modalRegisterBtn" style="display: none;">
                    <i class="fas fa-user-plus"></i>
                    Đăng ký tham gia
                </button>
                <button class="modal-btn modal-btn-secondary" onclick="shareActivity()">
                    <i class="fas fa-share-alt"></i>
                    Chia sẻ
                </button>
                <button class="modal-btn modal-btn-secondary" onclick="printActivity()">
                    <i class="fas fa-print"></i>
                    In
                </button>
                <button class="modal-btn modal-btn-secondary" onclick="addToCalendar()">
                    <i class="fas fa-calendar-plus"></i>
                    Thêm vào lịch
                </button>
                <button class="modal-btn modal-btn-primary" onclick="closeActivityModal()">
                    <i class="fas fa-times"></i>
                    Đóng
                </button>
            </div>
        </div>
    </div>




    <!-- Floating Action Button -->
    <div class="fab-container" id="fabContainer">
        <button class="fab-main" onclick="toggleFAB()">
            <i class="fas fa-plus"></i>
        </button>
        <div class="fab-menu">
            <button class="fab-item" onclick="scrollToTop()" title="Lên đầu trang">
                <i class="fas fa-arrow-up"></i>
            </button>
            <button class="fab-item" onclick="toggleFullscreen()" title="Toàn màn hình">
                <i class="fas fa-expand"></i>
            </button>
            <button class="fab-item" onclick="sharePage()" title="Chia sẻ">
                <i class="fas fa-share-alt"></i>
            </button>
            <button class="fab-item" onclick="printPage()" title="In trang">
                <i class="fas fa-print"></i>
            </button>
        </div>
    </div>

    <!-- Theme Toggle -->
    <button class="theme-toggle" onclick="toggleTheme()" id="themeToggle" title="Chuyển đổi chế độ">
        <i class="fas fa-moon"></i>
    </button>

    <!-- Statistics Dashboard Modal -->
    <div class="modal-overlay" id="statisticsModal">
        <div class="modal-content statistics-modal">
            <div class="modal-header">
                <h2><i class="fas fa-chart-bar"></i> Thống kê hoạt động</h2>
                <button class="modal-close" onclick="closeStatisticsModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="modal-body">
                <div class="stats-overview">
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-calendar-alt"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-number" id="totalActivitiesStat"><%= totalActivities %></div>
                            <div class="stat-label">Tổng hoạt động</div>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-eye"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-number" id="totalViewsStat">1,234</div>
                            <div class="stat-label">Lượt xem</div>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-star"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-number" id="featuredActivitiesStat"><%= ongoingActivities %></div>
                            <div class="stat-label">Nổi bật</div>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-chart-line"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-number" id="growthRateStat">+12%</div>
                            <div class="stat-label">Tăng trưởng</div>
                        </div>
                    </div>
                </div>
                
                <div class="stats-charts">
                    <div class="chart-container">
                        <h3>Hoạt động theo loại</h3>
                        <div class="chart-placeholder" id="typeChart">
                            <div class="chart-bar" style="height: 70%; background: linear-gradient(135deg, #3b82f6, #1d4ed8);">
                                <span>Sự kiện</span>
                                <div class="bar-value"><%= totalEvents %></div>
                            </div>
                            <div class="chart-bar" style="height: 55%; background: linear-gradient(135deg, #10b981, #059669);">
                                <span>Đào tạo</span>
                                <div class="bar-value"><%= totalTraining %></div>
                            </div>
                            <div class="chart-bar" style="height: 45%; background: linear-gradient(135deg, #f59e0b, #d97706);">
                                <span>Tin tức</span>
                                <div class="bar-value"><%= totalNews %></div>
                            </div>
                            <div class="chart-bar" style="height: 60%; background: linear-gradient(135deg, #8b5cf6, #7c3aed);">
                                <span>Cuộc họp</span>
                                <div class="bar-value"><%= totalMeetings %></div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="chart-container">
                        <h3>Xu hướng theo tháng</h3>
                        <div class="trend-chart" id="trendChart">
                            <div class="trend-line">
                                <div class="trend-point" style="left: 10%; bottom: 20%;"></div>
                                <div class="trend-point" style="left: 30%; bottom: 40%;"></div>
                                <div class="trend-point" style="left: 50%; bottom: 35%;"></div>
                                <div class="trend-point" style="left: 70%; bottom: 60%;"></div>
                                <div class="trend-point" style="left: 90%; bottom: 80%;"></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="stats-details">
                    <h3>Chi tiết thống kê</h3>
                    <div class="stats-table">
                        <div class="stats-row">
                            <span>Hoạt động được xem nhiều nhất:</span>
                            <span id="mostViewedActivity">Đang tải...</span>
                        </div>
                        <div class="stats-row">
                            <span>Ngày có nhiều hoạt động nhất:</span>
                            <span id="busiestDay">Đang tải...</span>
                        </div>
                        <div class="stats-row">
                            <span>Trung bình hoạt động/tháng:</span>
                            <span id="avgPerMonth">Đang tải...</span>
                        </div>
                        <div class="stats-row">
                            <span>Tỷ lệ hoạt động nổi bật:</span>
                            <span id="featuredRatio">Đang tải...</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="modal-actions">
                <button class="modal-btn modal-btn-secondary" onclick="exportStatistics()">
                    <i class="fas fa-download"></i>
                    Xuất báo cáo
                </button>
                <button class="modal-btn modal-btn-primary" onclick="closeStatisticsModal()">
                    <i class="fas fa-check"></i>
                    Đóng
                </button>
            </div>
        </div>
    </div>

    <!-- JavaScript for Enhanced Functionality -->
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Initialize page functionality
            initializeAnimations();
            initializeLoadMore();
            initializeSorting();
            initializeTheme();
            initializeProgressBar();
            initializeAdvancedFilter();
        });

        // Filter functionality
        function initializeFilters() {
            const filterBtns = document.querySelectorAll('.filter-btn');
            const activityCards = document.querySelectorAll('.activity-card');
            
            // Add click handlers to filter buttons
            filterBtns.forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    const filterType = this.getAttribute('href').split('filter=')[1];
                    
                    // Update active state
                    filterBtns.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Filter cards with animation
                    filterCards(filterType);
                    
                    // Update URL without page reload
                    const newUrl = window.location.pathname + '?filter=' + filterType;
                    history.pushState({filter: filterType}, '', newUrl);
                });
            });
            
            // Handle browser back/forward
            window.addEventListener('popstate', function(e) {
                if (e.state && e.state.filter) {
                    filterCards(e.state.filter);
                    updateActiveFilter(e.state.filter);
                }
            });
        }

        // Filter cards function
        function filterCards(filterType) {
            const activityCards = document.querySelectorAll('.activity-card');
            let visibleCount = 0;
            
            activityCards.forEach((card, index) => {
                const cardType = card.dataset.type || 'all';
                const shouldShow = filterType === 'all' || cardType === filterType;
                
                if (shouldShow) {
                    // Show with stagger animation
                    setTimeout(() => {
                        card.style.display = 'block';
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        
                        requestAnimationFrame(() => {
                            card.style.transition = 'all 0.3s ease';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        });
                    }, index * 50);
                    
                    visibleCount++;
                } else {
                    // Hide with animation
                    card.style.transition = 'all 0.2s ease';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(-10px)';
                    
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 200);
                }
            });
            
            // Update results count
            updateResultsCount(visibleCount, filterType);
        }

        // Update active filter button
        function updateActiveFilter(filterType) {
            const filterBtns = document.querySelectorAll('.filter-btn');
            filterBtns.forEach(btn => {
                btn.classList.remove('active');
                if (btn.getAttribute('href').includes('filter=' + filterType)) {
                    btn.classList.add('active');
                }
            });
        }

        // Update results count
        function updateResultsCount(count, filterType) {
            let message = '';
            switch(filterType) {
                case 'all':
                    message = `Hiển thị tất cả ${count} hoạt động`;
                    break;
                case 'event':
                    message = `Hiển thị ${count} sự kiện`;
                    break;
                case 'notification':
                    message = `Hiển thị ${count} thông báo`;
                    break;
                case 'schedule':
                    message = `Hiển thị ${count} lịch trình`;
                    break;
                default:
                    message = `Hiển thị ${count} kết quả`;
            }
            
            showToast(message, 'info');
        }


        // Initialize animations
        function initializeAnimations() {
            // Animate cards on scroll
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                    }
                });
            }, observerOptions);
            
            // Observe all activity cards
            document.querySelectorAll('.activity-card').forEach(card => {
                observer.observe(card);
            });
            
            // Add animation styles
            const animationStyles = `
                <style>
                .activity-card {
                    opacity: 0;
                    transform: translateY(30px);
                    transition: all 0.6s ease;
                }
                .activity-card.animate-in {
                    opacity: 1;
                    transform: translateY(0);
                }
                .stat-card {
                    animation: fadeInUp 0.6s ease forwards;
                }
                .stat-card:nth-child(1) { animation-delay: 0.1s; }
                .stat-card:nth-child(2) { animation-delay: 0.2s; }
                .stat-card:nth-child(3) { animation-delay: 0.3s; }
                .stat-card:nth-child(4) { animation-delay: 0.4s; }
                
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                </style>
            `;
            
            document.head.insertAdjacentHTML('beforeend', animationStyles);
        }

        // Load more functionality
        function initializeLoadMore() {
            const activitiesGrid = document.querySelector('.activities-grid');
            if (!activitiesGrid) return;
            
            const cards = activitiesGrid.querySelectorAll('.activity-card');
            const cardsPerPage = 6;
            let currentPage = 1;
            
            // Hide cards beyond first page
            if (cards.length > cardsPerPage) {
                cards.forEach((card, index) => {
                    if (index >= cardsPerPage) {
                        card.style.display = 'none';
                    }
                });
                
                // Add load more button
                const loadMoreBtn = document.createElement('div');
                loadMoreBtn.className = 'load-more-container';
                loadMoreBtn.innerHTML = `
                    <button class="load-more-btn" onclick="loadMoreActivities()">
                        <i class="fas fa-plus"></i>
                        Xem thêm hoạt động
                    </button>
                `;
                
                const loadMoreStyles = `
                    <style>
                    .load-more-container {
                        text-align: center;
                        margin-top: 3rem;
                    }
                    .load-more-btn {
                        display: inline-flex;
                        align-items: center;
                        gap: 0.5rem;
                        padding: 1rem 2rem;
                        background: var(--primary);
                        color: white;
                        border: none;
                        border-radius: 2rem;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        font-size: 1rem;
                    }
                    .load-more-btn:hover {
                        background: var(--secondary);
                        transform: translateY(-2px);
                        box-shadow: 0 8px 25px rgba(37, 99, 235, 0.3);
                    }
                    </style>
                `;
                
                document.head.insertAdjacentHTML('beforeend', loadMoreStyles);
                activitiesGrid.parentNode.appendChild(loadMoreBtn);
            }
        }

        // Load more activities function
        function loadMoreActivities() {
            const cards = document.querySelectorAll('.activity-card');
            const cardsPerPage = 6;
            const currentVisible = document.querySelectorAll('.activity-card[style*="display: block"], .activity-card:not([style*="display: none"])').length;
            const nextBatch = Math.min(currentVisible + cardsPerPage, cards.length);
            
            // Show next batch
            for (let i = currentVisible; i < nextBatch; i++) {
                if (cards[i]) {
                    cards[i].style.display = 'block';
                    setTimeout(() => {
                        cards[i].style.opacity = '1';
                        cards[i].style.transform = 'translateY(0)';
                    }, (i - currentVisible) * 100);
                }
            }
            
            // Hide load more button if all cards are shown
            if (nextBatch >= cards.length) {
                const loadMoreContainer = document.querySelector('.load-more-container');
                if (loadMoreContainer) {
                    loadMoreContainer.style.display = 'none';
                }
                showToast('Đã hiển thị tất cả hoạt động', 'info');
            }
        }

        // Toast notification system
        function showToast(message, type = 'info') {
            const toast = document.createElement('div');
            toast.className = `toast toast-${type}`;
            
            const icons = {
                success: 'fas fa-check-circle',
                error: 'fas fa-exclamation-circle',
                warning: 'fas fa-exclamation-triangle',
                info: 'fas fa-info-circle'
            };
            
            toast.innerHTML = `
                <i class="${icons[type]}"></i>
                <span>${message}</span>
                <button class="toast-close">&times;</button>
            `;
            
            // Toast styles
            const toastStyles = `
                <style>
                .toast {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: white;
                    border-radius: 0.5rem;
                    padding: 1rem 1.5rem;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    z-index: 1000;
                    min-width: 300px;
                    border-left: 4px solid;
                    animation: slideInRight 0.3s ease;
                }
                .toast-success { border-left-color: var(--success); color: var(--success); }
                .toast-error { border-left-color: var(--danger); color: var(--danger); }
                .toast-warning { border-left-color: var(--warning); color: var(--warning); }
                .toast-info { border-left-color: var(--info); color: var(--info); }
                
                .toast-close {
                    background: none;
                    border: none;
                    font-size: 1.2rem;
                    cursor: pointer;
                    color: var(--text-muted);
                    margin-left: auto;
                }
                
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                </style>
            `;
            
            if (!document.querySelector('style[data-toast-styles]')) {
                const styleEl = document.createElement('style');
                styleEl.setAttribute('data-toast-styles', 'true');
                styleEl.textContent = toastStyles.replace(/<\/?style>/g, '');
                document.head.appendChild(styleEl);
            }
            
            document.body.appendChild(toast);
            
            // Auto remove after 4 seconds
            setTimeout(() => {
                toast.style.animation = 'slideInRight 0.3s ease reverse';
                setTimeout(() => toast.remove(), 300);
            }, 4000);
            
            // Manual close
            toast.querySelector('.toast-close').addEventListener('click', () => {
                toast.style.animation = 'slideInRight 0.3s ease reverse';
                setTimeout(() => toast.remove(), 300);
            });
        }

        // Add data attributes to cards for filtering
        document.addEventListener('DOMContentLoaded', function() {
            const activityCards = document.querySelectorAll('.activity-card');
            activityCards.forEach((card, index) => {
                const typeElement = card.querySelector('.activity-type');
                if (typeElement) {
                    const typeText = typeElement.textContent.toLowerCase();
                    if (typeText.includes('sự kiện')) {
                        card.dataset.type = 'event';
                    } else if (typeText.includes('thông báo')) {
                        card.dataset.type = 'notification';
                    } else if (typeText.includes('lịch trình')) {
                        card.dataset.type = 'schedule';
                    } else {
                        card.dataset.type = 'activity';
                    }
                }
                
                // Add featured attribute randomly for demo
                if (Math.random() > 0.7) {
                    card.dataset.featured = 'true';
                }
                
                // Add location data attribute
                const locationElement = card.querySelector('[data-location]');
                if (locationElement) {
                    card.setAttribute('data-location', locationElement.textContent);
                }
                
                // Add click handler to entire card for modal
                card.style.cursor = 'pointer';
                card.title = 'Click để xem chi tiết';
                
                card.addEventListener('click', function(e) {
                    // Don't trigger if clicking on buttons
                    if (e.target.closest('button')) return;
                    
                    // Use card index as ID if no view button found
                    const viewBtn = card.querySelector('.activity-view-btn');
                    const activityId = viewBtn ? viewBtn.dataset.activityId : `card-${index}`;
                    
                    // Add loading feedback
                    showToast('Đang tải thông tin chi tiết...', 'info');
                    
                    // Small delay for better UX
                    setTimeout(() => {
                        openActivityModal(activityId);
                    }, 200);
                });
            });
        });


        // Sorting Functionality
        function initializeSorting() {
            const sortBy = document.getElementById('sortBy');
            const sortOrder = document.getElementById('sortOrder');
            
            sortBy.addEventListener('change', applySorting);
            sortOrder.addEventListener('change', applySorting);
        }

        function applySorting() {
            const sortBy = document.getElementById('sortBy').value;
            const sortOrder = document.getElementById('sortOrder').value;
            const activitiesGrid = document.getElementById('activitiesGrid');
            const cards = Array.from(activitiesGrid.querySelectorAll('.activity-card'));
            
            cards.sort((a, b) => {
                let aValue, bValue;
                
                switch(sortBy) {
                    case 'date':
                        aValue = new Date(a.dataset.date);
                        bValue = new Date(b.dataset.date);
                        break;
                    case 'title':
                        aValue = a.querySelector('.activity-title').textContent.toLowerCase();
                        bValue = b.querySelector('.activity-title').textContent.toLowerCase();
                        break;
                    case 'type':
                        aValue = a.dataset.type;
                        bValue = b.dataset.type;
                        break;
                    case 'featured':
                        aValue = a.dataset.featured === 'true' ? 1 : 0;
                        bValue = b.dataset.featured === 'true' ? 1 : 0;
                        break;
                    default:
                        return 0;
                }
                
                if (sortOrder === 'asc') {
                    return aValue > bValue ? 1 : -1;
                } else {
                    return aValue < bValue ? 1 : -1;
                }
            });
            
            // Re-append sorted cards
            cards.forEach(card => activitiesGrid.appendChild(card));
            
            showToast(`Đã sắp xếp theo ${sortBy} ${sortOrder === 'asc' ? 'tăng dần' : 'giảm dần'}`, 'success');
        }

        // Theme Toggle
        function initializeTheme() {
            const savedTheme = localStorage.getItem('theme') || 'light';
            document.documentElement.setAttribute('data-theme', savedTheme);
            updateThemeIcon(savedTheme);
        }

        function toggleTheme() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
            
            showToast(`Đã chuyển sang chế độ ${newTheme === 'dark' ? 'tối' : 'sáng'}`, 'info');
        }

        function updateThemeIcon(theme) {
            const themeToggle = document.getElementById('themeToggle');
            const icon = themeToggle.querySelector('i');
            
            if (theme === 'dark') {
                icon.className = 'fas fa-sun';
            } else {
                icon.className = 'fas fa-moon';
            }
        }

        // Progress Bar
        function initializeProgressBar() {
            const progressBar = document.getElementById('progressBar');
            
            window.addEventListener('scroll', () => {
                const scrollTop = window.pageYOffset;
                const docHeight = document.body.scrollHeight - window.innerHeight;
                const scrollPercent = (scrollTop / docHeight) * 100;
                
                progressBar.style.width = scrollPercent + '%';
                progressBar.classList.toggle('active', scrollPercent > 0);
            });
        }

        // Skeleton Loading
        function showSkeletonLoading() {
            const activitiesGrid = document.getElementById('activitiesGrid');
            const originalContent = activitiesGrid.innerHTML;
            
            // Show skeleton cards
            let skeletonHTML = '';
            for (let i = 0; i < 6; i++) {
                skeletonHTML += '<div class="skeleton skeleton-card"></div>';
            }
            activitiesGrid.innerHTML = skeletonHTML;
            
            // Restore content after 2 seconds
            setTimeout(() => {
                activitiesGrid.innerHTML = originalContent;
                showToast('Dữ liệu đã được làm mới', 'success');
            }, 2000);
        }

        // FAB Functions
        function toggleFAB() {
            const fabContainer = document.getElementById('fabContainer');
            fabContainer.classList.toggle('active');
        }

        function scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            toggleFAB();
        }

        function toggleFullscreen() {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
                showToast('Đã chuyển sang chế độ toàn màn hình', 'info');
            } else {
                document.exitFullscreen();
                showToast('Đã thoát chế độ toàn màn hình', 'info');
            }
            toggleFAB();
        }

        function sharePage() {
            if (navigator.share) {
                navigator.share({
                    title: document.title,
                    url: window.location.href
                });
            } else {
                // Fallback: copy to clipboard
                navigator.clipboard.writeText(window.location.href);
                showToast('Đã sao chép link vào clipboard', 'success');
            }
            toggleFAB();
        }

        function printPage() {
            window.print();
            toggleFAB();
        }



        // Keyboard Shortcuts
        document.addEventListener('keydown', function(e) {
            // Ctrl + K for search
            if (e.ctrlKey && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.getElementById('searchInput');
                if (searchInput) {
                    searchInput.focus();
                }
            }
            
            // Ctrl + D for dark mode
            if (e.ctrlKey && e.key === 'd') {
                e.preventDefault();
                toggleTheme();
            }
            
            // Ctrl + 1,2,3 for view modes
            if (e.ctrlKey && ['1', '2', '3'].includes(e.key)) {
                e.preventDefault();
                const viewModes = ['grid', 'list', 'compact'];
                const viewBtn = document.querySelector(`[data-view="${viewModes[parseInt(e.key) - 1]}"]`);
                if (viewBtn) {
                    viewBtn.click();
                }
            }
        });

        // Performance Monitoring
        function logPerformance() {
            if (window.performance) {
                const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
                console.log(`Page loaded in ${loadTime}ms`);
                
                if (loadTime > 3000) {
                    showToast('Trang tải chậm, vui lòng kiểm tra kết nối mạng', 'warning');
                }
            }
        }

        window.addEventListener('load', logPerformance);

        // Auto-save scroll position
        window.addEventListener('beforeunload', function() {
            localStorage.setItem('scrollPosition', window.pageYOffset);
        });

        window.addEventListener('load', function() {
            const savedPosition = localStorage.getItem('scrollPosition');
            if (savedPosition) {
                window.scrollTo(0, parseInt(savedPosition));
                localStorage.removeItem('scrollPosition');
            }
        });

        // Activity Modal Functions
        let currentActivityData = null;

        function openActivityModal(activityId) {
            // Find activity data from the page
            let activityCard = document.querySelector(`[data-activity-id="${activityId}"]`)?.closest('.activity-card');
            
            // If not found by data-activity-id, try to find by card index
            if (!activityCard && activityId.startsWith('card-')) {
                const cardIndex = parseInt(activityId.replace('card-', ''));
                const allCards = document.querySelectorAll('.activity-card');
                activityCard = allCards[cardIndex];
            }
            
            if (!activityCard) {
                showToast('Không tìm thấy thông tin hoạt động', 'error');
                return;
            }

            // Extract data from card
            const title = activityCard.querySelector('.activity-title')?.textContent || 'Không có tiêu đề';
            const description = activityCard.querySelector('.activity-description')?.textContent || 'Không có mô tả';
            const type = activityCard.querySelector('.activity-type')?.textContent || 'Hoạt động';
            const dateElement = activityCard.querySelector('.activity-date i + *');
            const date = dateElement ? dateElement.textContent.trim() : 'Chưa xác định';
            const location = activityCard.querySelector('[data-location]')?.textContent || 'Chưa xác định';
            const status = activityCard.querySelector('.activity-status')?.textContent || 'Không xác định';
            const image = activityCard.querySelector('.activity-image img')?.src || '';
            const typeIcon = activityCard.querySelector('.activity-image i')?.className || 'fas fa-calendar';
            const tags = Array.from(activityCard.querySelectorAll('.activity-tag')).map(tag => tag.textContent);

            // Store current activity data
            currentActivityData = {
                id: activityId,
                title: title,
                description: description,
                type: type,
                date: date,
                location: location,
                status: status,
                image: image,
                typeIcon: typeIcon,
                tags: tags
            };

            // Populate modal
            populateModal(currentActivityData);
            
            // Show modal
            const modal = document.getElementById('activityModal');
            
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            } else {
                showToast('Lỗi: Không tìm thấy modal', 'error');
                return;
            }

            // Track view
            trackActivityView(activityId);
        }

        function populateModal(data) {
            // Update hero section
            const modalHero = document.getElementById('modalHero');
            
            // Clear existing content
            modalHero.innerHTML = '';
            
            // Create elements safely
            if (data.image) {
                const img = document.createElement('img');
                img.src = data.image;
                img.alt = data.title;
                modalHero.appendChild(img);
            } else {
                const icon = document.createElement('i');
                icon.className = data.typeIcon;
                icon.style.cssText = 'font-size: 4rem; color: white; opacity: 0.8;';
                modalHero.appendChild(icon);
            }
            
            // Create overlay
            const overlay = document.createElement('div');
            overlay.className = 'modal-hero-overlay';
            
            const title = document.createElement('h2');
            title.className = 'modal-title';
            title.textContent = data.title;
            
            const meta = document.createElement('div');
            meta.className = 'modal-meta';
            
            const dateItem = document.createElement('div');
            dateItem.className = 'modal-meta-item';
            dateItem.innerHTML = '<i class="fas fa-calendar"></i>';
            const dateSpan = document.createElement('span');
            dateSpan.textContent = data.date;
            dateItem.appendChild(dateSpan);
            
            const locationItem = document.createElement('div');
            locationItem.className = 'modal-meta-item';
            locationItem.innerHTML = '<i class="fas fa-map-marker-alt"></i>';
            const locationSpan = document.createElement('span');
            locationSpan.textContent = data.location;
            locationItem.appendChild(locationSpan);
            
            meta.appendChild(dateItem);
            meta.appendChild(locationItem);
            overlay.appendChild(title);
            overlay.appendChild(meta);
            modalHero.appendChild(overlay);

            // Update description
            document.getElementById('modalDescription').textContent = data.description;

            // Update details
            document.getElementById('modalType').textContent = data.type;
            
            const statusBadge = document.getElementById('modalStatus');
            statusBadge.textContent = data.status;
            statusBadge.className = `modal-status-badge modal-status-${data.status.toLowerCase().includes('xuất bản') ? 'published' : 'draft'}`;

            // Update priority (random for demo)
            const priorities = ['high', 'medium', 'low'];
            const priorityLabels = ['Cao', 'Trung bình', 'Thấp'];
            const randomPriority = Math.floor(Math.random() * 3);
            
            const priorityBadge = document.getElementById('modalPriority');
            priorityBadge.textContent = priorityLabels[randomPriority];
            priorityBadge.className = `modal-priority-badge modal-priority-${priorities[randomPriority]}`;

            // Update other details
            document.getElementById('modalViews').textContent = Math.floor(Math.random() * 1000) + 1;
            document.getElementById('modalCreated').textContent = data.date;
            document.getElementById('modalUpdated').textContent = data.date;

            // Update tags
            const tagsSection = document.getElementById('modalTagsSection');
            const tagsContainer = document.getElementById('modalTags');
            
            // Clear existing tags
            tagsContainer.innerHTML = '';
            
            if (data.tags && data.tags.length > 0) {
                data.tags.forEach(tagText => {
                    const tagSpan = document.createElement('span');
                    tagSpan.className = 'modal-tag';
                    tagSpan.textContent = tagText;
                    tagsContainer.appendChild(tagSpan);
                });
                tagsSection.style.display = 'block';
            } else {
                tagsSection.style.display = 'none';
            }

            // Hide notes section for now
            document.getElementById('modalNotesSection').style.display = 'none';
            
            // Populate enhanced sections
            populateParticipantsInfo(data);
            populateContactInfo(data);
            populateAttachments(data);
            populateRelatedActivities(data);
        }

        function closeActivityModal() {
            const modal = document.getElementById('activityModal');
            modal.classList.remove('active');
            document.body.style.overflow = '';
            currentActivityData = null;
        }

        function shareActivity() {
            if (!currentActivityData) return;

            const shareData = {
                title: currentActivityData.title,
                text: currentActivityData.description,
                url: window.location.href
            };

            if (navigator.share) {
                navigator.share(shareData);
            } else {
                // Fallback: copy to clipboard
                const shareText = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
                navigator.clipboard.writeText(shareText).then(() => {
                    showToast('Đã sao chép thông tin hoạt động vào clipboard', 'success');
                });
            }
        }

        function printActivity() {
            if (!currentActivityData) return;

            // Escape HTML to prevent XSS
            function escapeHtml(text) {
                const div = document.createElement('div');
                div.textContent = text;
                return div.innerHTML;
            }

            const printWindow = window.open('', '_blank');
            const printContent = `
                <html>
                <head>
                    <title>${escapeHtml(currentActivityData.title)}</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        h1 { color: #2563eb; }
                        .meta { color: #666; margin: 10px 0; }
                        .description { line-height: 1.6; margin: 20px 0; }
                        .details { background: #f5f5f5; padding: 15px; border-radius: 5px; }
                    </style>
                </head>
                <body>
                    <h1>${escapeHtml(currentActivityData.title)}</h1>
                    <div class="meta">
                        <strong>Loại:</strong> ${escapeHtml(currentActivityData.type)}<br>
                        <strong>Ngày:</strong> ${escapeHtml(currentActivityData.date)}<br>
                        <strong>Địa điểm:</strong> ${escapeHtml(currentActivityData.location)}<br>
                        <strong>Trạng thái:</strong> ${escapeHtml(currentActivityData.status)}
                    </div>
                    <div class="description">
                        <h3>Mô tả:</h3>
                        <p>${escapeHtml(currentActivityData.description)}</p>
                    </div>
                    <div class="details">
                        <small>In từ: ${escapeHtml(window.location.href)}</small><br>
                        <small>Thời gian in: ${escapeHtml(new Date().toLocaleString('vi-VN'))}</small>
                    </div>
                </body>
                </html>
            `;
            
            printWindow.document.write(printContent);
            printWindow.document.close();
            printWindow.print();
        }

        function trackActivityView(activityId) {
            // Track activity view (could send to analytics)
            console.log(`Activity viewed: ${activityId}`);
            
            // Update view count in localStorage for demo
            const viewKey = `activity_views_${activityId}`;
            const currentViews = parseInt(localStorage.getItem(viewKey) || '0');
            const newViews = currentViews + 1;
            localStorage.setItem(viewKey, newViews.toString());
            
            // Update modal view count
            const modalViews = document.getElementById('modalViews');
            if (modalViews) {
                modalViews.textContent = newViews;
            }
        }

        // Enhanced Modal Functions
        function populateParticipantsInfo(data) {
            // Generate random participant data for demo
            const participantCount = Math.floor(Math.random() * 50) + 1;
            const maxParticipants = Math.random() > 0.5 ? Math.floor(Math.random() * 100) + 50 : '∞';
            
            document.getElementById('modalParticipantCount').textContent = participantCount;
            document.getElementById('modalMaxParticipants').textContent = maxParticipants;
            
            // Set registration status
            const statusElement = document.getElementById('modalRegistrationStatus');
            const registerBtn = document.getElementById('modalRegisterBtn');
            
            let statusClass, statusText, showRegisterBtn = false;
            
            if (maxParticipants !== '∞' && participantCount >= maxParticipants) {
                statusClass = 'status-full';
                statusText = 'Đã đầy';
            } else if (Math.random() > 0.8) {
                statusClass = 'status-closed';
                statusText = 'Đã đóng đăng ký';
            } else {
                statusClass = 'status-open';
                statusText = 'Đang mở đăng ký';
                showRegisterBtn = true;
            }
            
            statusElement.innerHTML = `<span class="status-badge ${statusClass}">${statusText}</span>`;
            registerBtn.style.display = showRegisterBtn ? 'inline-flex' : 'none';
        }

        function populateContactInfo(data) {
            // Generate demo contact info
            const contacts = [
                { person: 'Nguyễn Văn An', phone: '0123 456 789', email: 'nva@company.com' },
                { person: 'Trần Thị Bình', phone: '0987 654 321', email: 'ttb@company.com' },
                { person: 'Lê Minh Cường', phone: '0369 258 147', email: 'lmc@company.com' }
            ];
            
            const randomContact = contacts[Math.floor(Math.random() * contacts.length)];
            
            document.getElementById('modalContactPerson').textContent = randomContact.person;
            document.getElementById('modalContactPhone').textContent = randomContact.phone;
            document.getElementById('modalContactEmail').textContent = randomContact.email;
        }

        function populateAttachments(data) {
            const attachmentsSection = document.getElementById('modalAttachmentsSection');
            const attachmentsList = document.getElementById('modalAttachments');
            
            // Demo attachments
            const attachments = [
                { name: 'Thông tin chi tiết sự kiện.pdf', size: '2.3 MB', icon: 'fas fa-file-pdf', type: 'pdf' },
                { name: 'Biểu mẫu đăng ký.docx', size: '1.1 MB', icon: 'fas fa-file-word', type: 'doc' },
                { name: 'Hình ảnh sự kiện.zip', size: '15.7 MB', icon: 'fas fa-file-archive', type: 'zip' }
            ];
            
            if (Math.random() > 0.3) { // 70% chance to have attachments
                attachmentsList.innerHTML = '';
                
                const numAttachments = Math.floor(Math.random() * 3) + 1;
                for (let i = 0; i < numAttachments; i++) {
                    const attachment = attachments[i];
                    const attachmentElement = document.createElement('div');
                    attachmentElement.className = 'attachment-item';
                    attachmentElement.innerHTML = `
                        <div class="attachment-icon">
                            <i class="${attachment.icon}"></i>
                        </div>
                        <div class="attachment-info">
                            <div class="attachment-name">${attachment.name}</div>
                            <div class="attachment-size">${attachment.size}</div>
                        </div>
                        <i class="fas fa-download" style="color: var(--primary); cursor: pointer;"></i>
                    `;
                    
                    attachmentElement.addEventListener('click', () => {
                        showToast(`Đang tải xuống ${attachment.name}...`, 'info');
                    });
                    
                    attachmentsList.appendChild(attachmentElement);
                }
                
                attachmentsSection.style.display = 'block';
            } else {
                attachmentsSection.style.display = 'none';
            }
        }

        function populateRelatedActivities(data) {
            const relatedSection = document.getElementById('modalRelatedSection');
            const relatedContainer = document.getElementById('modalRelatedActivities');
            
            // Demo related activities
            const relatedActivities = [
                { title: 'Hội nghị tổng kết quý I', date: '15/03/2025' },
                { title: 'Workshop kỹ năng mềm', date: '22/03/2025' },
                { title: 'Team building tháng 3', date: '28/03/2025' },
                { title: 'Đào tạo an toàn lao động', date: '05/04/2025' }
            ];
            
            if (Math.random() > 0.4) { // 60% chance to have related activities
                relatedContainer.innerHTML = '';
                
                const numRelated = Math.floor(Math.random() * 3) + 1;
                for (let i = 0; i < numRelated; i++) {
                    const activity = relatedActivities[i];
                    const activityElement = document.createElement('div');
                    activityElement.className = 'related-activity-card';
                    activityElement.innerHTML = `
                        <div class="related-activity-title">${activity.title}</div>
                        <div class="related-activity-date">
                            <i class="fas fa-calendar"></i> ${activity.date}
                        </div>
                    `;
                    
                    activityElement.addEventListener('click', () => {
                        showToast(`Đang chuyển đến: ${activity.title}`, 'info');
                    });
                    
                    relatedContainer.appendChild(activityElement);
                }
                
                relatedSection.style.display = 'block';
            } else {
                relatedSection.style.display = 'none';
            }
        }

        // New Action Functions
        function registerActivity() {
            if (!currentActivityData) return;
            
            showToast('Đang xử lý đăng ký...', 'info');
            
            // Simulate registration process
            setTimeout(() => {
                showToast(`Đã đăng ký thành công cho "${currentActivityData.title}"!`, 'success');
                
                // Update participant count
                const countElement = document.getElementById('modalParticipantCount');
                const currentCount = parseInt(countElement.textContent);
                countElement.textContent = currentCount + 1;
                
                // Hide register button
                document.getElementById('modalRegisterBtn').style.display = 'none';
                
                // Update status if needed
                const maxParticipants = document.getElementById('modalMaxParticipants').textContent;
                if (maxParticipants !== '∞' && (currentCount + 1) >= parseInt(maxParticipants)) {
                    const statusElement = document.getElementById('modalRegistrationStatus');
                    statusElement.innerHTML = '<span class="status-badge status-full">Đã đầy</span>';
                }
            }, 1500);
        }

        function addToCalendar() {
            if (!currentActivityData) return;
            
            // Create calendar event data
            const eventData = {
                title: currentActivityData.title,
                description: currentActivityData.description,
                location: currentActivityData.location,
                startDate: new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
                endDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
            };
            
            // Create Google Calendar URL
            const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventData.title)}&dates=${eventData.startDate}/${eventData.endDate}&details=${encodeURIComponent(eventData.description)}&location=${encodeURIComponent(eventData.location)}`;
            
            // Open in new tab
            window.open(googleCalendarUrl, '_blank');
            showToast('Đã mở Google Calendar để thêm sự kiện', 'success');
        }

        // Close modal on overlay click
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('modal-overlay')) {
                closeActivityModal();
            }
        });

        // Close modal on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeActivityModal();
            }
        });

        // Add click handler to activity cards for mobile
        document.addEventListener('DOMContentLoaded', function() {
            // Add double-tap to open modal on mobile
            let lastTap = 0;
            document.addEventListener('touchend', function(e) {
                const currentTime = new Date().getTime();
                const tapLength = currentTime - lastTap;
                
                if (tapLength < 500 && tapLength > 0) {
                    const activityCard = e.target.closest('.activity-card');
                    if (activityCard) {
                        const viewBtn = activityCard.querySelector('.activity-view-btn');
                        if (viewBtn) {
                            viewBtn.click();
                        }
                    }
                }
                lastTap = currentTime;
            });
        });

        // Advanced Filter Functionality
        function initializeAdvancedFilter() {
            const filterTabs = document.querySelectorAll('.filter-tab');
            const searchInput = document.getElementById('advancedSearchInput');
            const clearSearchBtn = document.getElementById('clearAdvancedSearch');
            let currentFilter = 'all';
            let searchTimeout;


            // Filter tab click handlers
            filterTabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    const filterType = this.dataset.filter;
                    
                    // Update active tab
                    filterTabs.forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Apply filter
                    currentFilter = filterType;
                    const searchQuery = searchInput ? searchInput.value : '';
                    
                    // Check if we're already on the correct filter to avoid infinite reload
                    const currentUrlFilter = new URLSearchParams(window.location.search).get('filter') || 'all';
                    
                    // Only redirect if filter is different from current
                    if (filterType !== 'featured' && filterType !== currentUrlFilter) {
                        const newUrl = new URL(window.location);
                        newUrl.searchParams.set('filter', filterType);
                        if (searchQuery) {
                            newUrl.searchParams.set('search', searchQuery);
                        } else {
                            newUrl.searchParams.delete('search');
                        }
                        window.location.href = newUrl.toString();
                        return;
                    }
                    
                    // For client-side filtering or same filter, use JavaScript
                    applyAdvancedFilter(filterType, searchQuery);
                    
                    // Update URL
                    const newUrl = new URL(window.location);
                    newUrl.searchParams.set('filter', filterType);
                    history.pushState({filter: filterType}, '', newUrl);
                    
                    // Show feedback
                    const count = getFilteredCount(filterType, searchQuery);
                    showToast(`Hiển thị ${count} ${getFilterLabel(filterType)}`, 'info');
                });
            });

            // Search input handlers
            if (searchInput) {
                searchInput.addEventListener('input', function() {
                    const query = this.value.trim();
                    
                    // Show/hide clear button
                    if (clearSearchBtn) {
                        clearSearchBtn.style.display = query ? 'block' : 'none';
                    }
                    
                    // Debounced search
                    clearTimeout(searchTimeout);
                    searchTimeout = setTimeout(() => {
                        applyAdvancedFilter(currentFilter, query);
                        
                        if (query) {
                            const count = getFilteredCount(currentFilter, query);
                            showToast(`Tìm thấy ${count} kết quả cho "${query}"`, count > 0 ? 'success' : 'warning');
                        }
                    }, 300);
                });
            }

            // Clear search button
            if (clearSearchBtn) {
                clearSearchBtn.addEventListener('click', function() {
                    if (searchInput) {
                        searchInput.value = '';
                        this.style.display = 'none';
                        applyAdvancedFilter(currentFilter, '');
                        searchInput.focus();
                    }
                });
            }

            // Initialize from URL parameters
            const urlParams = new URLSearchParams(window.location.search);
            const urlFilter = urlParams.get('filter') || 'all';
            
            // Set active tab based on URL parameter
            filterTabs.forEach(tab => tab.classList.remove('active'));
            const targetTab = document.querySelector(`[data-filter="${urlFilter}"]`);
            if (targetTab) {
                targetTab.classList.add('active');
                currentFilter = urlFilter;
            } else {
                // Default to 'all' if filter not found
                const allTab = document.querySelector(`[data-filter="all"]`);
                if (allTab) {
                    allTab.classList.add('active');
                    currentFilter = 'all';
                }
            }
        }

        function applyAdvancedFilter(filterType, searchQuery) {
            const activityCards = document.querySelectorAll('.activity-card');
            let visibleCount = 0;

            activityCards.forEach((card, index) => {
                const cardType = card.dataset.type || 'all';
                const isFeatured = card.dataset.featured === 'true';
                const title = card.querySelector('.activity-title')?.textContent.toLowerCase() || '';
                const description = card.querySelector('.activity-description')?.textContent.toLowerCase() || '';
                const location = card.querySelector('[data-location]')?.textContent.toLowerCase() || '';
                
                // Check type filter
                let matchesType = false;
                if (filterType === 'all') {
                    matchesType = true;
                } else if (filterType === 'featured') {
                    matchesType = isFeatured;
                } else {
                    // Map new filter types to card content
                    const typeText = (title + ' ' + description).toLowerCase();
                    switch (filterType) {
                        case 'events':
                            matchesType = typeText.includes('sự kiện') || typeText.includes('event') || cardType === 'event';
                            break;
                        case 'training':
                            matchesType = typeText.includes('đào tạo') || typeText.includes('training') || typeText.includes('workshop') || typeText.includes('khóa học');
                            break;
                        case 'news':
                            matchesType = typeText.includes('tin tức') || typeText.includes('news') || typeText.includes('thông báo') || typeText.includes('announcement');
                            break;
                        case 'meetings':
                            matchesType = typeText.includes('họp') || typeText.includes('meeting') || typeText.includes('conference') || typeText.includes('hội nghị');
                            break;
                        default:
                            matchesType = cardType === filterType;
                    }
                }
                
                // Check search query
                const matchesSearch = !searchQuery || 
                    title.includes(searchQuery.toLowerCase()) || 
                    description.includes(searchQuery.toLowerCase()) ||
                    location.includes(searchQuery.toLowerCase());
                
                const shouldShow = matchesType && matchesSearch;
                
                if (shouldShow) {
                    // Show with stagger animation
                    setTimeout(() => {
                        card.style.display = 'block';
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        
                        requestAnimationFrame(() => {
                            card.style.transition = 'all 0.3s ease';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        });
                    }, index * 30);
                    
                    visibleCount++;
                } else {
                    // Hide with animation
                    card.style.transition = 'all 0.2s ease';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(-10px)';
                    
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 200);
                }
            });

            // Update filter counts
            updateFilterCounts();
            
            return visibleCount;
        }

        function getFilteredCount(filterType, searchQuery) {
            const activityCards = document.querySelectorAll('.activity-card');
            let count = 0;

            activityCards.forEach(card => {
                const cardType = card.dataset.type || 'all';
                const isFeatured = card.dataset.featured === 'true';
                const title = card.querySelector('.activity-title')?.textContent.toLowerCase() || '';
                const description = card.querySelector('.activity-description')?.textContent.toLowerCase() || '';
                const location = card.querySelector('[data-location]')?.textContent.toLowerCase() || '';
                
                // Check type filter
                let matchesType = false;
                if (filterType === 'all') {
                    matchesType = true;
                } else if (filterType === 'featured') {
                    matchesType = isFeatured;
                } else {
                    // Map new filter types to card content
                    const typeText = (title + ' ' + description).toLowerCase();
                    switch (filterType) {
                        case 'events':
                            matchesType = typeText.includes('sự kiện') || typeText.includes('event') || cardType === 'event';
                            break;
                        case 'training':
                            matchesType = typeText.includes('đào tạo') || typeText.includes('training') || typeText.includes('workshop') || typeText.includes('khóa học');
                            break;
                        case 'news':
                            matchesType = typeText.includes('tin tức') || typeText.includes('news') || typeText.includes('thông báo') || typeText.includes('announcement');
                            break;
                        case 'meetings':
                            matchesType = typeText.includes('họp') || typeText.includes('meeting') || typeText.includes('conference') || typeText.includes('hội nghị');
                            break;
                        default:
                            matchesType = cardType === filterType;
                    }
                }
                
                const matchesSearch = !searchQuery || 
                    title.includes(searchQuery.toLowerCase()) || 
                    description.includes(searchQuery.toLowerCase()) ||
                    location.includes(searchQuery.toLowerCase());
                
                if (matchesType && matchesSearch) {
                    count++;
                }
            });

            return count;
        }

        function getFilterLabel(filterType) {
            const labels = {
                'all': 'hoạt động',
                'events': 'sự kiện',
                'training': 'đào tạo',
                'news': 'tin tức',
                'meetings': 'cuộc họp',
                'featured': 'hoạt động nổi bật'
            };
            return labels[filterType] || 'kết quả';
        }

        function updateFilterCounts() {
            const filterTabs = document.querySelectorAll('.filter-tab');
            
            filterTabs.forEach(tab => {
                const filterType = tab.dataset.filter;
                const count = getFilteredCount(filterType, '');
                const countElement = tab.querySelector('.filter-count');
                
                if (countElement) {
                    countElement.textContent = `(${count})`;
                }
            });
        }


        // Enhanced keyboard shortcuts for advanced filter
        document.addEventListener('keydown', function(e) {
            // Ctrl + F for focus search
            if (e.ctrlKey && e.key === 'f') {
                e.preventDefault();
                const searchInput = document.getElementById('advancedSearchInput');
                if (searchInput) {
                    searchInput.focus();
                    searchInput.select();
                }
            }
            
            // Number keys for filter tabs (1-5 for 5 tabs)
            if (e.altKey && ['1', '2', '3', '4', '5'].includes(e.key)) {
                e.preventDefault();
                const filterTabs = document.querySelectorAll('.filter-tab');
                const tabIndex = parseInt(e.key) - 1;
                
                if (filterTabs[tabIndex]) {
                    filterTabs[tabIndex].click();
                }
            }
        });

        // Auto-update filter counts on page load
        window.addEventListener('load', function() {
            setTimeout(updateFilterCounts, 1000);
            setTimeout(updateFeaturedCount, 1200);
            setTimeout(updateServerCounts, 1500);
        });

        // Update counts from server-side data
        function updateServerCounts() {
            // Update counts from server variables
            const eventsCount = document.getElementById('eventsCount');
            const trainingCount = document.getElementById('trainingCount');
            const newsCount = document.getElementById('newsCount');
            const meetingsCount = document.getElementById('meetingsCount');
            
            if (eventsCount) eventsCount.textContent = `(<%= totalEvents %>)`;
            if (trainingCount) trainingCount.textContent = `(<%= totalTraining %>)`;
            if (newsCount) newsCount.textContent = `(<%= totalNews %>)`;
            if (meetingsCount) meetingsCount.textContent = `(<%= totalMeetings %>)`;
        }

        // Update featured count specifically
        function updateFeaturedCount() {
            const featuredCards = document.querySelectorAll('.activity-card[data-featured="true"]');
            const featuredCountElement = document.getElementById('featuredCount');
            
            if (featuredCountElement) {
                featuredCountElement.textContent = `(${featuredCards.length})`;
            }
            
            // Add special effect if there are featured items
            if (featuredCards.length > 0) {
                const featuredTab = document.querySelector('.filter-featured');
                if (featuredTab) {
                    featuredTab.classList.add('has-items');
                }
            }
        }


        function showStatistics() {
            const modal = document.getElementById('statisticsModal');
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Animate stat numbers
            animateStatNumbers();
            
            // Load detailed stats
            loadDetailedStats();
            
            showToast('Đã mở dashboard thống kê', 'info');
        }

        function closeStatisticsModal() {
            const modal = document.getElementById('statisticsModal');
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }

        function animateStatNumbers() {
            const statNumbers = document.querySelectorAll('.stat-number');
            
            statNumbers.forEach(element => {
                const finalValue = parseInt(element.textContent.replace(/[^\d]/g, '')) || 0;
                let currentValue = 0;
                const increment = Math.ceil(finalValue / 50);
                
                const timer = setInterval(() => {
                    currentValue += increment;
                    if (currentValue >= finalValue) {
                        currentValue = finalValue;
                        clearInterval(timer);
                    }
                    
                    if (element.textContent.includes('%')) {
                        element.textContent = `+${currentValue}%`;
                    } else if (element.textContent.includes(',')) {
                        element.textContent = currentValue.toLocaleString();
                    } else {
                        element.textContent = currentValue;
                    }
                }, 30);
            });
        }

        function loadDetailedStats() {
            // Simulate loading detailed statistics
            setTimeout(() => {
                document.getElementById('mostViewedActivity').textContent = 'Hội nghị tổng kết năm 2024';
                document.getElementById('busiestDay').textContent = 'Thứ 2, 15/01/2025';
                document.getElementById('avgPerMonth').textContent = '12.5 hoạt động';
                document.getElementById('featuredRatio').textContent = '23.5%';
            }, 1000);
        }

        function exportStatistics() {
            const statsData = {
                overview: {
                    totalActivities: document.getElementById('totalActivitiesStat').textContent,
                    totalViews: document.getElementById('totalViewsStat').textContent,
                    featuredActivities: document.getElementById('featuredActivitiesStat').textContent,
                    growthRate: document.getElementById('growthRateStat').textContent
                },
                details: {
                    mostViewed: document.getElementById('mostViewedActivity').textContent,
                    busiestDay: document.getElementById('busiestDay').textContent,
                    avgPerMonth: document.getElementById('avgPerMonth').textContent,
                    featuredRatio: document.getElementById('featuredRatio').textContent
                },
                exportDate: new Date().toISOString()
            };
            
            const dataStr = JSON.stringify(statsData, null, 2);
            const dataBlob = new Blob([dataStr], {type: 'application/json'});
            const url = URL.createObjectURL(dataBlob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `activity_statistics_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            showToast('Đã xuất báo cáo thống kê thành công', 'success');
        }


        // Close statistics modal on overlay click
        document.addEventListener('click', function(e) {
            if (e.target.id === 'statisticsModal') {
                closeStatisticsModal();
            }
        });

        // Enhanced keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            // Ctrl + S for statistics
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                showStatistics();
            }
        });
    </script>
</body>
</html>
