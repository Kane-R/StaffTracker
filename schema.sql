DROP DATABASE IF EXISTS StaffTracker;
CREATE database StaffTracker;

USE stafftracker;

CREATE TABLE `department` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `staff` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(30) DEFAULT NULL,
  `last_name` varchar(30) DEFAULT NULL,
  `role_id` int DEFAULT NULL,
  `manager_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(30) DEFAULT NULL,
  `salary` decimal(10,0) DEFAULT NULL,
  `department_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE VIEW `stafftracker`.`v_allstaffs` AS
    SELECT 
        `stafftracker`.`staff`.`first_name` AS `first_name`,
        `stafftracker`.`staff`.`last_name` AS `last_name`,
        `stafftracker`.`role`.`title` AS `title`,
        CONCAT(`managers`.`first_name`,
                ' ',
                `managers`.`last_name`) AS `manager_name`
    FROM
        ((`stafftracker`.`staff`
        LEFT JOIN `stafftracker`.`role` ON ((`stafftracker`.`staff`.`role_id` = `stafftracker`.`role`.`id`)))
        LEFT JOIN `stafftracker`.`staff` `managers` ON ((`stafftracker`.`staff`.`manager_id` = `managers`.`id`)));
        
CREATE VIEW `stafftracker`.`v_allmanagers` AS
    SELECT 
        `stafftracker`.`staff`.`id` AS `id`,
        CONCAT(`stafftracker`.`staff`.`first_name`,
                ' ',
                `stafftracker`.`staff`.`last_name`) AS `Name`,
        `stafftracker`.`department`.`name` AS `Department`,
        `stafftracker`.`role`.`title` AS `title`
    FROM
        ((`stafftracker`.`staff`
        LEFT JOIN `stafftracker`.`role` ON ((`stafftracker`.`staff`.`role_id` = `stafftracker`.`role`.`id`)))
        LEFT JOIN `stafftracker`.`department` ON ((`stafftracker`.`role`.`department_id` = `stafftracker`.`department`.`id`)))
    WHERE
        (`stafftracker`.`role`.`title` LIKE '%Manager')
    ORDER BY `stafftracker`.`staff`.`id`;
    
CREATE VIEW `stafftracker`.`v_staffsbymanager` AS
    SELECT 
        CONCAT(`manager`.`first_name`,
                ' ',
                `manager`.`last_name`) AS `manager`,
        CONCAT(`stafftracker`.`staff`.`first_name`,
                ' ',
                `stafftracker`.`staff`.`last_name`) AS `staff`
    FROM
        (`stafftracker`.`staff`
        JOIN `stafftracker`.`staff` `manager` ON ((`stafftracker`.`staff`.`manager_id` = `manager`.`id`)))
    ORDER BY `manager`.`manager_id`;

CREATE VIEW `stafftracker`.`v_empswithids` AS
    SELECT 
        `stafftracker`.`staff`.`id` AS `id`,
        `stafftracker`.`staff`.`role_id` AS `role_id`,
        `stafftracker`.`staff`.`first_name` AS `first_name`,
        `stafftracker`.`staff`.`last_name` AS `last_name`,
        `stafftracker`.`role`.`title` AS `title`,
        CONCAT(`managers`.`first_name`,
                ' ',
                `managers`.`last_name`) AS `manager_name`
    FROM
        ((`stafftracker`.`staff`
        LEFT JOIN `stafftracker`.`role` ON ((`stafftracker`.`staff`.`role_id` = `stafftracker`.`role`.`id`)))
        LEFT JOIN `stafftracker`.`staff` `managers` ON ((`stafftracker`.`staff`.`manager_id` = `managers`.`id`)));
        
CREATE VIEW `stafftracker`.`v_roles` AS
    SELECT 
        `stafftracker`.`role`.`id` AS `role_id`,
        `stafftracker`.`role`.`title` AS `title`,
        `stafftracker`.`role`.`salary` AS `salary`,
        `stafftracker`.`department`.`name` AS `Department_name`
    FROM
        (`stafftracker`.`role`
        LEFT JOIN `stafftracker`.`department` ON ((`stafftracker`.`role`.`department_id` = `stafftracker`.`department`.`id`)));
        
CREATE VIEW `stafftracker`.`v_salariesbydept` AS
    SELECT 
        `stafftracker`.`department`.`name` AS `name`,
        SUM(`stafftracker`.`role`.`salary`) AS `total_Salaries`
    FROM
        ((`stafftracker`.`staff`
        JOIN `stafftracker`.`role` ON ((`stafftracker`.`staff`.`role_id` = `stafftracker`.`role`.`id`)))
        JOIN `stafftracker`.`department` ON ((`stafftracker`.`role`.`department_id` = `stafftracker`.`department`.`id`)))
    GROUP BY `stafftracker`.`role`.`department_id`;