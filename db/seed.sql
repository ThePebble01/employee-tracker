INSERT into department(name)
VALUES ("Sales"), ("Service");

INSERT into role(title, salary, department_id)
VALUES ("Sales Development Rep", 10, 0), ("Sales Rep", 20, 0), ("Sales Manager", 30, 0),
("Support Agent", 10, 1), ("Senior Support Agent", 20, 1), ("Support Manager", 66, 1);

INSERT into employee(id, first_name, last_name, role_id, manager_id)
VALUES (1, "Bolin", "Smol", 3, null), (2, "Aaron", "Rodgerz", 2, 1), (3, "Michelle", "Deux", 2, 1), (4, "Tyr", "Schorson", 1, 1),
(5, "Bruno", "Salzar", 6, null), (6, "Tammy", "Fring", 5, 5), (7, "Jahnny", "G-Unit", 5, 5), (8, "Dakota", "Moore", 4, 6);
