INSERT into department(name)
VALUES ("Sales"), ("Service");

INSERT into role(title, salary, department_id)
VALUES ("Sales Development Rep", 10, 1), ("Sales Rep", 20, 1), ("Sales Manager", 30, 1),
("Support Agent", 10, 2), ("Senior Support Agent", 20, 2), ("Support Manager", 66, 2);

INSERT into employee(first_name, last_name, role_id, manager_id)
VALUES ("Bolin", "Smol", 3, null), ("Aaron", "Rodgerz", 2, 1), ("Michelle", "Deux", 2, 1), ("Tyr", "Schorson", 1, 1),
("Bruno", "Salzar", 6, null), ("Tammy", "Fring", 5, 5), ("Jahnny", "G-Unit", 5, 5), ("Dakota", "Moore", 4, 6);