-- Check if database and table exist
USE master;

-- Check if database exists
IF EXISTS (SELECT name FROM sys.databases WHERE name = 'ctcdb')
    PRINT 'Database ctcdb EXISTS'
ELSE
    PRINT 'Database ctcdb NOT FOUND'

-- Switch to database if exists
IF EXISTS (SELECT name FROM sys.databases WHERE name = 'ctcdb')
BEGIN
    USE ctcdb;
    
    -- Check if Activities table exists
    IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Activities')
    BEGIN
        PRINT 'Activities table EXISTS'
        
        -- Check table structure
        SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'Activities'
        ORDER BY ORDINAL_POSITION;
        
        -- Check current data
        SELECT COUNT(*) as TotalRows FROM Activities;
        SELECT COUNT(*) as PublishedRows FROM Activities WHERE IsPublished = 1;
        
    END
    ELSE
        PRINT 'Activities table NOT FOUND'
END
