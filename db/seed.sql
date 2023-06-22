INSERT into department(name)
VALUES ("Sales"), ("Service");

INSERT into role(title, salary, department_id)
VALUES ("Sales Development Rep", 30000, 1), ("Sales Rep", 40000, 1), ("Sales Manager", 60000, 1),
("Support Agent", 20000, 2), ("Senior Support Agent", 40000, 2), ("Support Manager", 66000, 2);

INSERT into employee(first_name, last_name, role_id, manager_id)
VALUES ("Bolin", "Smol", 3, null), ("Aaron", "Rodgerz", 2, 1), ("Michelle", "Deux", 2, 1), ("Tyr", "Schorson", 1, 1),
("Bruno", "Salzar", 6, null), ("Tammy", "Fring", 5, 5), ("Jahnny", "G-Unit", 5, 5), ("Dakota", "Moore", 4, 6);