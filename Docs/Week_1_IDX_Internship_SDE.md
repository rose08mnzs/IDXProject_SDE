# WEEK 1 - Environment Setup & Database Import

## Create new directory
```bash
 mkdir idxproject
 cd idxproject
```

## Install and verify Node.js
```bash
 node -v
 npm -v
```

## Install and check git
```bash
 git --version
```

## Create MYSQL 8 Container
```bash
docker run --name idx-mysql-local -p 3306:3306 -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=rets -d mysql:8
```

## Start MYSQL Container
```bash
docker start idx-mysql-local
```

## Checking if its running 
```bash
docker ps
```

## Connect to database
```bash
docker exec -it idx-mysql-local mysql -u root -ppassword
```

## Import SQL Files
```bash
docker exec -i idx-mysql-local mysql -u root -ppassword rets < "rets_openhouse.sql"
docker exec -i idx-mysql-local mysql -u root -ppassword rets < "rets_property.sql"
```

## Check database
```sql
SHOW DATABASES;
```

## Use database
```sql
USE rets;
```

## Check tables
```sql
SHOW TABLES;
```

## Check table info
```sql
DESCRIBE rets_property;
DESCRIBE rets_openhouse;
```

## SQL Query to check count of data in tables 
```sql
SELECT COUNT(*) FROM rets_property;
SELECT COUNT(*) FROM rets_openhouse;
```
