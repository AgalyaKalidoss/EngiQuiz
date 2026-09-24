/**
 * EngiQuiz - Comprehensive Question Bank
 * All questions are technically verified with accurate single answers and detailed explanations.
 */

const RAW_QUESTIONS = [
  // ==========================================
  // 1. JAVA (20 Questions: 8 Easy, 8 Medium, 4 Hard)
  // ==========================================
  {
    id: "java-001",
    branch: "CSE",
    subject: "Java",
    topic: "Basics",
    difficulty: "Easy",
    question: "Which component of the Java environment is responsible for executing bytecode directly on the host machine?",
    options: ["Java Development Kit (JDK)", "Java Virtual Machine (JVM)", "Java Compiler (javac)", "Java Runtime Environment (JRE) only"],
    answer: 1,
    explanation: "The JVM (Java Virtual Machine) is the abstract machine that interprets or JIT-compiles Java bytecode into machine code for the host platform."
  },
  {
    id: "java-002",
    branch: "CSE",
    subject: "Java",
    topic: "Basics",
    difficulty: "Easy",
    question: "What is the default value of an uninitialized boolean instance variable in Java?",
    options: ["true", "false", "0", "null"],
    answer: 1,
    explanation: "In Java, instance and static primitive boolean variables are automatically initialized to 'false' by default."
  },
  {
    id: "java-003",
    branch: "CSE",
    subject: "Java",
    topic: "OOP",
    difficulty: "Easy",
    question: "Which keyword is used in Java to prevent a class from being inherited by subclasses?",
    options: ["static", "final", "abstract", "const"],
    answer: 1,
    explanation: "The 'final' keyword on a class declaration (e.g. public final class MyClass) prevents any subclassing or inheritance."
  },
  {
    id: "java-004",
    branch: "CSE",
    subject: "Java",
    topic: "OOP",
    difficulty: "Easy",
    question: "Which of the following OOP principles allows one interface to control access to multiple specific implementations at runtime?",
    options: ["Encapsulation", "Inheritance", "Polymorphism", "Abstraction"],
    answer: 2,
    explanation: "Polymorphism (specifically dynamic method dispatch or subtype polymorphism) enables a single reference type to execute behavior tailored to the specific concrete implementation."
  },
  {
    id: "java-005",
    branch: "CSE",
    subject: "Java",
    topic: "Collections",
    difficulty: "Easy",
    question: "Which Java Collections framework interface guarantees elements are unique and does not allow duplicate entries?",
    options: ["List", "Queue", "Set", "Vector"],
    answer: 2,
    explanation: "The java.util.Set interface models the mathematical set abstraction and explicitly forbids duplicate elements."
  },
  {
    id: "java-006",
    branch: "CSE",
    subject: "Java",
    topic: "Exception Handling",
    difficulty: "Easy",
    question: "Which block in Java is always executed whether an exception is thrown or caught (unless JVM exits abruptly)?",
    options: ["try", "catch", "finally", "throw"],
    answer: 2,
    explanation: "The 'finally' block always executes after try/catch blocks complete, making it ideal for cleanup routines like closing file handles and sockets."
  },
  {
    id: "java-007",
    branch: "CSE",
    subject: "Java",
    topic: "Basics",
    difficulty: "Easy",
    question: "What is the size of the primitive 'int' data type in Java?",
    options: ["16 bits (2 bytes)", "32 bits (4 bytes)", "64 bits (8 bytes)", "Platform-dependent"],
    answer: 1,
    explanation: "In Java, primitive types are strictly platform-independent. An 'int' is always exactly 32 bits (4 bytes), signed two's complement."
  },
  {
    id: "java-008",
    branch: "CSE",
    subject: "Java",
    topic: "OOP",
    difficulty: "Easy",
    question: "Which method must be overridden to compare two objects for logical equality in Java?",
    options: ["compareTo()", "equals()", "hashCode()", "toString()"],
    answer: 1,
    explanation: "The equals(Object obj) method defined in java.lang.Object is overridden to test for value equivalence rather than reference identity."
  },
  {
    id: "java-009",
    branch: "CSE",
    subject: "Java",
    topic: "Collections",
    difficulty: "Medium",
    question: "How does HashMap resolve hash collisions in Java 8 and later when the bucket linked list becomes too large?",
    options: ["Linear Probing", "Converts bucket list into a Red-Black balanced tree", "Throws a HashCollisionException", "Rehashes the entire table into a B-Tree"],
    answer: 1,
    explanation: "Starting in Java 8, when a bucket contains more than TREEIFY_THRESHOLD (8 items) and the table capacity is at least 64, HashMap transforms the linked list into a balanced Red-Black tree to improve search time from O(n) to O(log n)."
  },
  {
    id: "java-010",
    branch: "CSE",
    subject: "Java",
    topic: "Multithreading",
    difficulty: "Medium",
    question: "What is the primary effect of marking a field with the 'volatile' keyword in Java?",
    options: ["Guarantees atomic compound operations like incrementing", "Ensures read/write operations bypass CPU caches and are visible immediately to all threads", "Locks the object monitor during access", "Prevents the garbage collector from reclaiming the field"],
    answer: 1,
    explanation: "The 'volatile' keyword guarantees memory visibility across threads by establishing a happens-before relationship and preventing instruction reordering, though it does not guarantee atomicity for compound operations like count++."
  },
  {
    id: "java-011",
    branch: "CSE",
    subject: "Java",
    topic: "Exception Handling",
    difficulty: "Medium",
    question: "Which of the following classes is an unchecked exception in Java?",
    options: ["java.io.IOException", "java.sql.SQLException", "java.lang.NullPointerException", "java.lang.ClassNotFoundException"],
    answer: 2,
    explanation: "NullPointerException extends RuntimeException. All subclasses of RuntimeException and Error are unchecked exceptions; the compiler does not enforce try-catch or throws clauses."
  },
  {
    id: "java-012",
    branch: "CSE",
    subject: "Java",
    topic: "OOP",
    difficulty: "Medium",
    question: "Can an abstract class in Java have concrete methods, instance variables, and constructors?",
    options: ["No, abstract classes can only contain abstract method signatures", "Yes, abstract classes can have constructors, state, and implemented methods", "Only static methods can have implementations", "Only if the class implements Serializable"],
    answer: 1,
    explanation: "Abstract classes in Java can have fields, constructors (invoked by subclass constructors via super()), and fully implemented concrete methods."
  },
  {
    id: "java-013",
    branch: "CSE",
    subject: "Java",
    topic: "Memory Management",
    difficulty: "Medium",
    question: "Where are objects allocated during runtime execution in the standard HotSpot JVM?",
    options: ["In Thread Stack memory", "In the Metaspace", "On the Heap", "In the Native Method Stack"],
    answer: 2,
    explanation: "All Java objects and arrays are dynamically allocated on the Heap, which is shared among all active threads and managed by the Garbage Collector."
  },
  {
    id: "java-014",
    branch: "CSE",
    subject: "Java",
    topic: "Multithreading",
    difficulty: "Medium",
    question: "What state does a Java Thread enter when it invokes Object.wait()?",
    options: ["TIMED_WAITING", "WAITING", "BLOCKED", "RUNNABLE"],
    answer: 1,
    explanation: "Invoking wait() without a timeout argument places the calling thread into the WAITING state until another thread invokes notify() or notifyAll() on that object's monitor."
  },
  {
    id: "java-015",
    branch: "CSE",
    subject: "Java",
    topic: "Collections",
    difficulty: "Medium",
    question: "What is the key difference between ArrayList and LinkedList when retrieving an element by index via get(int index)?",
    options: ["ArrayList is O(1) random access; LinkedList is O(n) sequential traversal", "LinkedList is O(1); ArrayList is O(n)", "Both provide strictly O(1) retrieval", "Both provide O(log n) retrieval"],
    answer: 0,
    explanation: "ArrayList is backed by a contiguous array giving direct O(1) indexing, whereas LinkedList must traverse pointer nodes from head/tail taking O(n) steps."
  },
  {
    id: "java-016",
    branch: "CSE",
    subject: "Java",
    topic: "Basics",
    difficulty: "Medium",
    question: "Why is String designed to be immutable in Java?",
    options: ["To save JVM compilation time", "For security, caching in the String Pool, hashcode caching, and thread-safety", "Because Java does not support character arrays", "To enable multiple inheritance"],
    answer: 1,
    explanation: "String immutability permits string interning (String Pool), guarantees thread safety without synchronization, caches hash codes for fast Map lookups, and prevents parameter tampering in sensitive security APIs."
  },
  {
    id: "java-017",
    branch: "CSE",
    subject: "Java",
    topic: "Memory Management",
    difficulty: "Hard",
    question: "Which JVM generational garbage collection area is primarily intended for newly instantiated short-lived objects?",
    options: ["Old (Tenured) Generation", "Metaspace", "Eden Space of Young Generation", "Survivor Space S1"],
    answer: 2,
    explanation: "New objects are initially allocated in the Eden space of the Young Generation. Objects that survive successive minor garbage collections are copied to Survivor spaces and eventually tenured into Old Generation."
  },
  {
    id: "java-018",
    branch: "CSE",
    subject: "Java",
    topic: "Multithreading",
    difficulty: "Hard",
    question: "What low-level hardware primitive does java.util.concurrent.atomic.AtomicInteger rely on to achieve lock-free thread safety?",
    options: ["Test-and-Set spinlock", "Compare-And-Swap (CAS)", "Pthread mutex locks", "Two-Phase Commit (2PC)"],
    answer: 1,
    explanation: "AtomicInteger uses CPU-supported Compare-And-Swap (CAS) instructions (via sun.misc.Unsafe / VarHandle), allowing lock-free concurrent updates with optimistic retries."
  },
  {
    id: "java-019",
    branch: "CSE",
    subject: "Java",
    topic: "OOP",
    difficulty: "Hard",
    question: "What occurs if an overridden method in a subclass attempts to declare a checked exception not declared by the superclass method?",
    options: ["It works without warnings", "A runtime ExceptionInInitializerError occurs", "A compile-time error occurs because overridden methods cannot broaden checked exceptions", "The exception is silently converted to an unchecked RuntimeException"],
    answer: 2,
    explanation: "Under the Liskov Substitution Principle enforced by Java, an overriding method cannot declare broader or new checked exceptions than those declared by the superclass method."
  },
  {
    id: "java-020",
    branch: "CSE",
    subject: "Java",
    topic: "Collections",
    difficulty: "Hard",
    question: "If class Person overrides equals() to compare 'id' but fails to override hashCode(), what is the direct consequence when using Person as a key in a HashSet?",
    options: ["A compile error occurs immediately", "Equal Person objects may have different hashcodes and end up in different buckets, leading to duplicate entries", "HashSet automatically calculates an MD5 hash", "The JVM throws a ConcurrentModificationException"],
    answer: 1,
    explanation: "The contract states that equal objects must have equal hashcodes. If hashCode() is not overridden, two logically equal instances produce different default identity hashes, landing in different buckets and violating HashSet uniqueness."
  },

  // ==========================================
  // 2. PYTHON (20 Questions: 8 Easy, 8 Medium, 4 Hard)
  // ==========================================
  {
    id: "py-001",
    branch: "CSE",
    subject: "Python",
    topic: "Basics",
    difficulty: "Easy",
    question: "Which of the following built-in data types in Python is immutable?",
    options: ["list", "dict", "tuple", "set"],
    answer: 2,
    explanation: "A tuple is an immutable sequence in Python; once created, its elements cannot be reassigned, added, or removed."
  },
  {
    id: "py-002",
    branch: "CSE",
    subject: "Python",
    topic: "Basics",
    difficulty: "Easy",
    question: "What is the output of the expression: type(lambda x: x + 1)?",
    options: ["<class 'lambda'>", "<class 'function'>", "<class 'expression'>", "<class 'builtin_function'>"],
    answer: 1,
    explanation: "In Python, anonymous lambda expressions are instances of the standard 'function' class, identical in type to functions defined with 'def'."
  },
  {
    id: "py-003",
    branch: "CSE",
    subject: "Python",
    topic: "Data Structures",
    difficulty: "Easy",
    question: "What operator is used for floor division (integer quotient) in Python?",
    options: ["/", "%", "//", "**"],
    answer: 2,
    explanation: "The '//' operator performs floor division, returning the largest integer less than or equal to the algebraic quotient."
  },
  {
    id: "py-004",
    branch: "CSE",
    subject: "Python",
    topic: "Functions & Scopes",
    difficulty: "Easy",
    question: "What keyword is used inside a function to modify a variable defined in the global scope?",
    options: ["nonlocal", "global", "extern", "var"],
    answer: 1,
    explanation: "The 'global' keyword informs Python that an assignment within a local scope targets the module-level global variable."
  },
  {
    id: "py-005",
    branch: "CSE",
    subject: "Python",
    topic: "Data Structures",
    difficulty: "Easy",
    question: "What is the average time complexity for key lookup in a Python dictionary?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    answer: 0,
    explanation: "Python dictionaries are implemented using an optimized open-addressing hash table, giving average-case O(1) key lookup."
  },
  {
    id: "py-006",
    branch: "CSE",
    subject: "Python",
    topic: "Basics",
    difficulty: "Easy",
    question: "What does the expression bool([]) evaluate to in Python?",
    options: ["True", "False", "None", "Error"],
    answer: 1,
    explanation: "Empty sequence collections (empty list [], tuple (), set set(), dict {}, string '') are falsy and evaluate to False."
  },
  {
    id: "py-007",
    branch: "CSE",
    subject: "Python",
    topic: "OOP",
    difficulty: "Easy",
    question: "Which special dunder method is invoked when an instance of a class is created to initialize its attributes?",
    options: ["__create__()", "__init__()", "__new__()", "__construct__()"],
    answer: 1,
    explanation: "__init__() is the initializer method in Python classes, called immediately after __new__() creates the object instance."
  },
  {
    id: "py-008",
    branch: "CSE",
    subject: "Python",
    topic: "Exceptions & File I/O",
    difficulty: "Easy",
    question: "What statement is best practice in Python to ensure files are properly closed even if exceptions occur?",
    options: ["open().close() inline", "with open(...) as f:", "try...finally without open", "file.auto_close()"],
    answer: 1,
    explanation: "The 'with' statement leverages the context manager protocol (__enter__ and __exit__), ensuring the file descriptor is closed cleanly upon block exit."
  },
  {
    id: "py-009",
    branch: "CSE",
    subject: "Python",
    topic: "Generators & Decorators",
    difficulty: "Medium",
    question: "What keyword turns a standard Python function into a generator that produces values lazily on demand?",
    options: ["produce", "yield", "emit", "return lazy"],
    answer: 1,
    explanation: "Using the 'yield' keyword inside a function body causes it to return a generator object that preserves execution state between calls to next()."
  },
  {
    id: "py-010",
    branch: "CSE",
    subject: "Python",
    topic: "Functions & Scopes",
    difficulty: "Medium",
    question: "Why should you never use a mutable default argument like 'def add_item(val, target=[])' in Python?",
    options: ["It raises a SyntaxError", "The default list is instantiated only once when the function is parsed, and is shared across all subsequent invocations", "The list is deleted when the function finishes", "It causes recursion limit errors"],
    answer: 1,
    explanation: "Default parameter expressions in Python are evaluated once at function definition time. A mutable object like [] persists across calls, accumulating items."
  },
  {
    id: "py-011",
    branch: "CSE",
    subject: "Python",
    topic: "Basics",
    difficulty: "Medium",
    question: "What does the Global Interpreter Lock (GIL) in CPython do?",
    options: ["It prevents Python code from importing external C libraries", "It is a mutex that prevents multiple native threads from executing Python bytecodes simultaneously in one process", "It locks the operating system kernel during garbage collection", "It restricts memory allocation to 4GB"],
    answer: 1,
    explanation: "The GIL is a mutex in CPython that ensures only one native OS thread executes Python bytecode at any moment, simplifying thread-safe memory management at the cost of true CPU-bound parallelism."
  },
  {
    id: "py-012",
    branch: "CSE",
    subject: "Python",
    topic: "Data Structures",
    difficulty: "Medium",
    question: "What is the result of the slicing operation 'lst[::-1]' on a list lst?",
    options: ["Clears the list", "Returns a shallow copy of the list in reverse order", "Removes the last item of the list", "Throws an IndexError"],
    answer: 1,
    explanation: "The slice syntax [start:stop:step] with step=-1 and omitted start/stop produces a reversed shallow copy of the sequence."
  },
  {
    id: "py-013",
    branch: "CSE",
    subject: "Python",
    topic: "OOP",
    difficulty: "Medium",
    question: "How does Python resolve method calls in multiple inheritance hierarchies?",
    options: ["Depth-First Search exclusively", "Breadth-First Search exclusively", "C3 Linearization algorithm to determine Method Resolution Order (MRO)", "Random selection among parent classes"],
    answer: 2,
    explanation: "Python uses the C3 Linearization algorithm to compute a deterministic Method Resolution Order (MRO), accessible via ClassName.__mro__."
  },
  {
    id: "py-014",
    branch: "CSE",
    subject: "Python",
    topic: "Data Structures",
    difficulty: "Medium",
    question: "What is the difference between 'is' and '==' in Python?",
    options: ["'is' compares values, '==' compares memory addresses", "'is' checks object identity (same memory address), while '==' checks value equality", "They are identical aliases", "'is' works only with strings"],
    answer: 1,
    explanation: "'is' checks whether two variables reference the exact same object in memory (id(a) == id(b)), while '==' invokes the __eq__() method to verify equality of values."
  },
  {
    id: "py-015",
    branch: "CSE",
    subject: "Python",
    topic: "Generators & Decorators",
    difficulty: "Medium",
    question: "What does a decorator function return when wrapping a target function in Python?",
    options: ["A boolean indicating if the target function is valid", "A callable object (usually a wrapper function)", "The return value of the wrapped function immediately", "A dictionary of function parameters"],
    answer: 1,
    explanation: "A decorator is a higher-order function that accepts a callable as an argument and returns a new callable (closure wrapper) that adds behavior."
  },
  {
    id: "py-016",
    branch: "CSE",
    subject: "Python",
    topic: "Basics",
    difficulty: "Medium",
    question: "What is the output of 'print(0.1 + 0.2 == 0.3)' in Python?",
    options: ["True", "False", "None", "ZeroDivisionError"],
    answer: 1,
    explanation: "Due to IEEE 754 floating-point binary representation, 0.1 + 0.2 evaluates to approximately 0.30000000000000004, which does not exactly equal 0.3."
  },
  {
    id: "py-017",
    branch: "CSE",
    subject: "Python",
    topic: "OOP",
    difficulty: "Hard",
    question: "What does defining '__slots__' inside a Python class definition achieve?",
    options: ["Restricts method calls to registered threads", "Prevents the creation of an instance '__dict__', dramatically saving memory and preventing arbitrary new attribute assignments", "Enforces static type checking at runtime", "Makes all class methods private"],
    answer: 1,
    explanation: "By defining '__slots__ = ('x', 'y')', Python allocates a fixed space for attribute pointers rather than creating a dynamic dictionary per instance, reducing memory overhead."
  },
  {
    id: "py-018",
    branch: "CSE",
    subject: "Python",
    topic: "Basics",
    difficulty: "Hard",
    question: "How does Python's cyclic garbage collector detect circular references between unreachable objects?",
    options: ["By tracking reference counts alone", "By isolating container objects and tracking trials of decremented reference counts across three generations", "By pausing the OS kernel and running Cheney's copying collector", "By using Java-style mark-and-sweep on the entire RAM"],
    answer: 1,
    explanation: "CPython uses reference counting as its primary mechanism and supplements it with a generational cyclic garbage collector that tracks container objects to break unreachable cycles."
  },
  {
    id: "py-019",
    branch: "CSE",
    subject: "Python",
    topic: "Generators & Decorators",
    difficulty: "Hard",
    question: "What method can be called on a Python generator object to pass a value back into the generator where it was paused at a 'yield' expression?",
    options: ["generator.send(value)", "generator.push(value)", "generator.inject(value)", "generator.resume(value)"],
    answer: 0,
    explanation: "The generator.send(value) method resumes the generator execution and passes 'value' as the result of the current yield expression."
  },
  {
    id: "py-020",
    branch: "CSE",
    subject: "Python",
    topic: "OOP",
    difficulty: "Hard",
    question: "In Python metaclasses, what is the signature of the class creation hook '__new__' in a custom metaclass?",
    options: ["__new__(cls, name, bases, dct)", "__new__(self, target_class)", "__new__(name, type, *args)", "__new__(cls, *modules)"],
    answer: 0,
    explanation: "A metaclass __new__ method receives (cls, name, bases, dct): the metaclass itself, the class name string, a tuple of base classes, and the class namespace dictionary."
  },

  // ==========================================
  // 3. DBMS (20 Questions: 8 Easy, 8 Medium, 4 Hard)
  // ==========================================
  {
    id: "dbms-001",
    branch: "CSE",
    subject: "DBMS",
    topic: "ER Model",
    difficulty: "Easy",
    question: "In an Entity-Relationship (ER) diagram, what geometric shape is conventionally used to represent a relationship between entities?",
    options: ["Rectangle", "Ellipse", "Diamond", "Double Rectangle"],
    answer: 2,
    explanation: "In standard Chen ER notation, entities are represented by rectangles, attributes by ellipses, and relationships by diamonds."
  },
  {
    id: "dbms-002",
    branch: "CSE",
    subject: "DBMS",
    topic: "Transactions & ACID",
    difficulty: "Easy",
    question: "Which ACID property guarantees that all database changes of a transaction are executed completely, or none are applied if a failure occurs?",
    options: ["Atomicity", "Consistency", "Isolation", "Durability"],
    answer: 0,
    explanation: "Atomicity ('all-or-nothing') ensures that a transaction cannot be partially committed; if any step fails, the entire transaction is rolled back."
  },
  {
    id: "dbms-003",
    branch: "CSE",
    subject: "DBMS",
    topic: "Relational Algebra",
    difficulty: "Easy",
    question: "Which relational algebra operator is used to choose specific columns (attributes) from a relation?",
    options: ["Selection (σ)", "Projection (π)", "Cartesian Product (×)", "Join (⋈)"],
    answer: 1,
    explanation: "Projection (denoted by Greek letter π) filters vertical subsets (columns), whereas Selection (σ) filters horizontal subsets (rows)."
  },
  {
    id: "dbms-004",
    branch: "CSE",
    subject: "DBMS",
    topic: "Normalization",
    difficulty: "Easy",
    question: "A relation is in First Normal Form (1NF) if and only if:",
    options: ["Every non-key attribute is fully functionally dependent on the primary key", "All attribute values are atomic and there are no repeating groups", "Transitive dependencies are eliminated", "It has no candidate keys"],
    answer: 1,
    explanation: "1NF requires that each column contains only atomic (indivisible) values and each row contains no repeated sets or arrays of columns."
  },
  {
    id: "dbms-005",
    branch: "CSE",
    subject: "DBMS",
    topic: "Transactions & ACID",
    difficulty: "Easy",
    question: "Which ACID property ensures that committed transactions survive subsequent system crashes or power failures?",
    options: ["Atomicity", "Consistency", "Isolation", "Durability"],
    answer: 3,
    explanation: "Durability guarantees that once a transaction has committed, its updates are recorded in non-volatile storage and will persist through system crashes."
  },
  {
    id: "dbms-006",
    branch: "CSE",
    subject: "DBMS",
    topic: "ER Model",
    difficulty: "Easy",
    question: "What is a primary key?",
    options: ["Any column that contains numerical data", "A candidate key chosen to uniquely identify each tuple in a relation", "A key that references another table", "An optional attribute that can be NULL"],
    answer: 1,
    explanation: "A primary key is a minimal superkey (candidate key) selected by the database designer that uniquely and non-nullably identifies each row in a relation."
  },
  {
    id: "dbms-007",
    branch: "CSE",
    subject: "DBMS",
    topic: "ER Model",
    difficulty: "Easy",
    question: "What does an entity set called a 'Weak Entity' lack?",
    options: ["A relationship with any other entity", "Sufficient attributes to form its own primary key", "An ER representation", "Any foreign key attributes"],
    answer: 1,
    explanation: "A weak entity set does not possess enough attributes to form a primary key on its own; it depends on an identifying relationship with a strong owner entity."
  },
  {
    id: "dbms-008",
    branch: "CSE",
    subject: "DBMS",
    topic: "Transactions & ACID",
    difficulty: "Easy",
    question: "What state does a database transaction enter after successfully executing its final statement?",
    options: ["Committed", "Partially Committed", "Active", "Aborted"],
    answer: 1,
    explanation: "After executing the final operation, a transaction enters the Partially Committed state. Once the commit log is flushed to disk, it enters the Committed state."
  },
  {
    id: "dbms-009",
    branch: "CSE",
    subject: "DBMS",
    topic: "Normalization",
    difficulty: "Medium",
    question: "To be in Second Normal Form (2NF), a relation must be in 1NF and have:",
    options: ["No partial dependency of non-prime attributes on any candidate key", "No transitive dependencies", "Multi-valued dependencies removed", "All functional dependencies as trivial dependencies"],
    answer: 0,
    explanation: "2NF disallows partial functional dependency: every non-prime attribute must be fully functionally dependent on the whole candidate key, not a proper subset of it."
  },
  {
    id: "dbms-010",
    branch: "CSE",
    subject: "DBMS",
    topic: "Normalization",
    difficulty: "Medium",
    question: "Which normal form requires that for every functional dependency X -> Y, X must be a superkey?",
    options: ["1NF", "2NF", "3NF", "Boyce-Codd Normal Form (BCNF)"],
    answer: 3,
    explanation: "BCNF is a stricter version of 3NF. In BCNF, for every non-trivial functional dependency X -> Y, X must be a superkey."
  },
  {
    id: "dbms-011",
    branch: "CSE",
    subject: "DBMS",
    topic: "Concurrency",
    difficulty: "Medium",
    question: "What concurrency problem occurs when a transaction reads data that has been modified by another uncommitted transaction that later aborts?",
    options: ["Lost Update", "Dirty Read (Uncommitted Dependency)", "Non-repeatable Read", "Phantom Read"],
    answer: 1,
    explanation: "A dirty read occurs when transaction T1 updates a row without committing, T2 reads that updated row, and then T1 rolls back, leaving T2 with invalid data."
  },
  {
    id: "dbms-012",
    branch: "CSE",
    subject: "DBMS",
    topic: "Indexing & Hashing",
    difficulty: "Medium",
    question: "Why are B+ Trees preferred over standard Binary Search Trees for disk-based database indexes?",
    options: ["B+ Trees store all keys in memory only", "High branching factor (fan-out) minimizes disk I/O operations, and linked leaf nodes enable fast range scans", "Binary Search Trees consume more CPU cache", "B+ Trees eliminate the need for primary keys"],
    answer: 1,
    explanation: "B+ trees have a high fan-out leading to very shallow trees (low disk I/O depth), and all records/keys are stored in sequence-linked leaf nodes, making sequential range scans extremely fast."
  },
  {
    id: "dbms-013",
    branch: "CSE",
    subject: "DBMS",
    topic: "Concurrency",
    difficulty: "Medium",
    question: "In Two-Phase Locking (2PL), what happens during the 'shrinking phase'?",
    options: ["The transaction can acquire new locks", "The transaction can only release existing locks and cannot acquire any new locks", "The database tables are compressed", "The transaction buffer is cleared"],
    answer: 1,
    explanation: "Under 2PL, a transaction acquires locks during its growing phase. Once it releases a single lock, it enters the shrinking phase and can never acquire any additional lock."
  },
  {
    id: "dbms-014",
    branch: "CSE",
    subject: "DBMS",
    topic: "Indexing & Hashing",
    difficulty: "Medium",
    question: "What is a clustered index in a relational database?",
    options: ["An index where the physical order of rows in the table matches the indexed order", "An index stored on a separate cloud cluster", "An index that contains all columns of a table", "An index that allows duplicate keys"],
    answer: 0,
    explanation: "A clustered index determines the actual physical storage order of rows in a table. Consequently, a table can possess only one clustered index (typically on the primary key)."
  },
  {
    id: "dbms-015",
    branch: "CSE",
    subject: "DBMS",
    topic: "Relational Algebra",
    difficulty: "Medium",
    question: "If relation R has 4 tuples and relation S has 5 tuples, how many tuples will be in the Cartesian product (R × S)?",
    options: ["9", "20", "1", "Cannot be determined without schemas"],
    answer: 1,
    explanation: "The Cartesian product pairs each tuple of R with every tuple of S, resulting in cardinality |R| × |S| = 4 × 5 = 20 tuples."
  },
  {
    id: "dbms-016",
    branch: "CSE",
    subject: "DBMS",
    topic: "Transactions & ACID",
    difficulty: "Medium",
    question: "What is the purpose of the Write-Ahead Logging (WAL) protocol in database management systems?",
    options: ["To log SQL queries before executing them for analytics", "To ensure log records describing changes are flushed to stable storage before the corresponding data pages are written to disk", "To compress user tables before writes", "To lock the database during backup creation"],
    answer: 1,
    explanation: "WAL ensures that before any dirty database page is written to disk, the log records describing the update are written to stable non-volatile storage, guaranteeing Atomicity and Durability during recovery."
  },
  {
    id: "dbms-017",
    branch: "CSE",
    subject: "DBMS",
    topic: "Concurrency",
    difficulty: "Hard",
    question: "How can you test if a schedule of concurrent transactions is conflict serializable?",
    options: ["By checking if there are no deadlocks", "By constructing a precedence (serialization) graph and checking if it is acyclic (contains no cycles)", "By verifying that all transactions commit within 1 second", "By ensuring that all reads occur before any writes"],
    answer: 1,
    explanation: "A schedule is conflict serializable if and only if its precedence graph (dependency graph of conflicting read/write operations) contains no directed cycles."
  },
  {
    id: "dbms-018",
    branch: "CSE",
    subject: "DBMS",
    topic: "Transactions & ACID",
    difficulty: "Hard",
    question: "In the ANSI SQL isolation levels, which isolation level prevents Dirty Reads and Non-repeatable Reads, but may still permit Phantom Reads?",
    options: ["Read Uncommitted", "Read Committed", "Repeatable Read", "Serializable"],
    answer: 2,
    explanation: "Under Repeatable Read isolation, transactions hold shared locks on retrieved rows until transaction completion, preventing non-repeatable reads, but range locks are not held, allowing phantom inserts."
  },
  {
    id: "dbms-019",
    branch: "CSE",
    subject: "DBMS",
    topic: "Normalization",
    difficulty: "Hard",
    question: "What is a lossless-join decomposition of relation R into R1 and R2?",
    options: ["R1 and R2 have no common attributes", "The natural join of R1 and R2 yields exactly relation R without any spurious tuples (i.e. (R1 ∩ R2) -> R1 or (R1 ∩ R2) -> R2)", "R1 and R2 both have identical primary keys", "The decomposition preserves all database constraints without foreign keys"],
    answer: 1,
    explanation: "A decomposition of R into (R1, R2) is lossless if and only if the common attribute set (R1 ∩ R2) forms a superkey of at least one of the decomposed relations (R1 or R2)."
  },
  {
    id: "dbms-020",
    branch: "CSE",
    subject: "DBMS",
    topic: "Concurrency",
    difficulty: "Hard",
    question: "What deadlock prevention scheme assigns timestamps to transactions and aborts/rolls back the requesting transaction if it is younger than the holding transaction?",
    options: ["Wait-Die Scheme", "Wound-Wait Scheme", "Two-Phase Commit", "Optimistic Concurrency Control"],
    answer: 0,
    explanation: "In the Wait-Die non-preemptive scheme: if an older transaction requests a resource held by a younger one, it waits; if a younger transaction requests a resource held by an older one, the younger one dies (aborts and rolls back)."
  },

  // ==========================================
  // 4. SQL (20 Questions: 8 Easy, 8 Medium, 4 Hard)
  // ==========================================
  {
    id: "sql-001",
    branch: "CSE",
    subject: "SQL",
    topic: "Basic Queries",
    difficulty: "Easy",
    question: "Which SQL clause is used to eliminate duplicate rows from the query result set?",
    options: ["UNIQUE", "DISTINCT", "DIFFERENT", "FILTER"],
    answer: 1,
    explanation: "The SELECT DISTINCT clause removes duplicate tuples from the final output table."
  },
  {
    id: "sql-002",
    branch: "CSE",
    subject: "SQL",
    topic: "Basic Queries",
    difficulty: "Easy",
    question: "Which wildcard character in SQL LIKE pattern matching represents zero, one, or multiple characters?",
    options: ["?", "_", "%", "*"],
    answer: 2,
    explanation: "In SQL LIKE clauses, '%' matches any sequence of zero or more characters, while '_' matches exactly one single character."
  },
  {
    id: "sql-003",
    branch: "CSE",
    subject: "SQL",
    topic: "DDL & DML",
    difficulty: "Easy",
    question: "Which SQL command permanently deletes all records from a table without logging individual row deletions, but preserves the table structure?",
    options: ["DELETE", "DROP", "TRUNCATE", "REMOVE"],
    answer: 2,
    explanation: "TRUNCATE TABLE quickly empties a table by deallocating its storage pages without firing row-level triggers or logging row-by-row deletions, preserving the table schema."
  },
  {
    id: "sql-004",
    branch: "CSE",
    subject: "SQL",
    topic: "Constraints & Keys",
    difficulty: "Easy",
    question: "What is the primary purpose of the FOREIGN KEY constraint in SQL?",
    options: ["To ensure values in a column are strictly alphanumeric", "To enforce referential integrity between two related tables", "To automatically create a primary index", "To permit negative values in numeric fields"],
    answer: 1,
    explanation: "A FOREIGN KEY enforces referential integrity by requiring that a value in the child table must match an existing primary/unique key value in the referenced parent table, or be NULL."
  },
  {
    id: "sql-005",
    branch: "CSE",
    subject: "SQL",
    topic: "Aggregation & Grouping",
    difficulty: "Easy",
    question: "Which SQL clause is used to filter aggregated data generated by a GROUP BY clause?",
    options: ["WHERE", "HAVING", "ORDER BY", "QUALIFY"],
    answer: 1,
    explanation: "HAVING is evaluated after group creation to filter aggregated results (e.g. HAVING COUNT(*) > 5), whereas WHERE filters individual rows before grouping."
  },
  {
    id: "sql-006",
    branch: "CSE",
    subject: "SQL",
    topic: "Joins",
    difficulty: "Easy",
    question: "Which JOIN returns all rows from the left table and the matched rows from the right table, filling with NULL when there is no match?",
    options: ["INNER JOIN", "LEFT OUTER JOIN", "RIGHT OUTER JOIN", "CROSS JOIN"],
    answer: 1,
    explanation: "A LEFT (OUTER) JOIN keeps all records from the left table regardless of whether there is a corresponding match in the right table."
  },
  {
    id: "sql-007",
    branch: "CSE",
    subject: "SQL",
    topic: "Basic Queries",
    difficulty: "Easy",
    question: "How do you test for a NULL value in an SQL WHERE condition?",
    options: ["WHERE column = NULL", "WHERE column == NULL", "WHERE column IS NULL", "WHERE column IN (NULL)"],
    answer: 2,
    explanation: "In SQL three-valued logic (TRUE, FALSE, UNKNOWN), comparisons with '= NULL' yield UNKNOWN. You must use 'IS NULL' or 'IS NOT NULL'."
  },
  {
    id: "sql-008",
    branch: "CSE",
    subject: "SQL",
    topic: "DDL & DML",
    difficulty: "Easy",
    question: "Which category does the SQL statement 'ALTER TABLE' belong to?",
    options: ["Data Manipulation Language (DML)", "Data Definition Language (DDL)", "Data Control Language (DCL)", "Transaction Control Language (TCL)"],
    answer: 1,
    explanation: "ALTER TABLE modifies the schema of database objects, which falls squarely into Data Definition Language (DDL)."
  },
  {
    id: "sql-009",
    branch: "CSE",
    subject: "SQL",
    topic: "Aggregation & Grouping",
    difficulty: "Medium",
    question: "What is the difference between COUNT(*) and COUNT(column_name) in SQL?",
    options: ["COUNT(*) counts all rows including NULLs; COUNT(column_name) counts only rows where column_name is NOT NULL", "There is no difference", "COUNT(*) only counts primary key rows", "COUNT(column_name) returns distinct values automatically"],
    answer: 0,
    explanation: "COUNT(*) tallies every tuple in the group regardless of contents, while COUNT(column) ignores rows where that specific column contains NULL."
  },
  {
    id: "sql-010",
    branch: "CSE",
    subject: "SQL",
    topic: "Joins",
    difficulty: "Medium",
    question: "What is a CROSS JOIN between two tables with 10 rows and 6 rows respectively?",
    options: ["A join returning 16 rows", "A Cartesian product returning 60 rows", "A join that matches identical column names", "A syntax error unless an ON condition is supplied"],
    answer: 1,
    explanation: "A CROSS JOIN produces the Cartesian product of the two tables: 10 × 6 = 60 rows."
  },
  {
    id: "sql-011",
    branch: "CSE",
    subject: "SQL",
    topic: "Subqueries",
    difficulty: "Medium",
    question: "What is a correlated subquery in SQL?",
    options: ["A subquery that runs once before the outer query starts", "A subquery that references columns from the outer query and must be evaluated once for every row processed by the outer query", "A subquery with two SELECT statements joined by UNION", "A subquery used only inside an INSERT clause"],
    answer: 1,
    explanation: "A correlated subquery depends on values from the current row of the enclosing outer query, requiring execution for each candidate row of the outer query."
  },
  {
    id: "sql-012",
    branch: "CSE",
    subject: "SQL",
    topic: "Subqueries",
    difficulty: "Medium",
    question: "Which SQL operator returns TRUE if the subquery returns at least one row?",
    options: ["IN", "EXISTS", "ANY", "ALL"],
    answer: 1,
    explanation: "EXISTS tests for the presence of any rows matching the subquery condition, short-circuiting as soon as the first matching tuple is found."
  },
  {
    id: "sql-013",
    branch: "CSE",
    subject: "SQL",
    topic: "Constraints & Keys",
    difficulty: "Medium",
    question: "Can a table in SQL have multiple UNIQUE constraints and multiple PRIMARY KEY constraints?",
    options: ["Yes, unlimited of both", "No, only one UNIQUE and one PRIMARY KEY", "It can have multiple UNIQUE constraints, but only ONE PRIMARY KEY constraint", "It can have multiple PRIMARY KEYs, but only one UNIQUE"],
    answer: 2,
    explanation: "A table may have only one primary key (which can be composite across multiple columns), but can define multiple distinct UNIQUE constraints."
  },
  {
    id: "sql-014",
    branch: "CSE",
    subject: "SQL",
    topic: "Basic Queries",
    difficulty: "Medium",
    question: "What is the result of 'SELECT COALESCE(NULL, NULL, 'EngiQuiz', 'Default');'?",
    options: ["NULL", "'EngiQuiz'", "'Default'", "Error"],
    answer: 1,
    explanation: "COALESCE() evaluates its arguments in left-to-right order and returns the first non-NULL expression encountered."
  },
  {
    id: "sql-015",
    branch: "CSE",
    subject: "SQL",
    topic: "Joins",
    difficulty: "Medium",
    question: "What is the difference between UNION and UNION ALL?",
    options: ["UNION returns all rows; UNION ALL removes duplicate records", "UNION removes duplicate rows from the combined result set; UNION ALL retains all rows including duplicates", "UNION works on single tables; UNION ALL works across databases", "They are identical in SQL standard"],
    answer: 1,
    explanation: "UNION performs a distinct sort/hash operation to eliminate duplicate tuples, making it slower than UNION ALL, which simply concatenates result sets without deduplication."
  },
  {
    id: "sql-016",
    branch: "CSE",
    subject: "SQL",
    topic: "Aggregation & Grouping",
    difficulty: "Medium",
    question: "In what order are the logical processing phases of an SQL query executed by the database engine?",
    options: ["SELECT -> FROM -> WHERE -> GROUP BY -> HAVING", "FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY", "WHERE -> FROM -> SELECT -> HAVING -> ORDER BY", "FROM -> SELECT -> WHERE -> ORDER BY"],
    answer: 1,
    explanation: "Logical SQL evaluation follows: FROM (joins) -> WHERE -> GROUP BY -> HAVING -> SELECT (projections/expressions) -> DISTINCT -> ORDER BY -> LIMIT/OFFSET."
  },
  {
    id: "sql-017",
    branch: "CSE",
    subject: "SQL",
    topic: "Subqueries",
    difficulty: "Hard",
    question: "What is the difference between RANK() and DENSE_RANK() window functions when ranking rows with identical values?",
    options: ["RANK() leaves gaps in rank numbering after ties (e.g. 1, 2, 2, 4); DENSE_RANK() does not leave gaps (e.g. 1, 2, 2, 3)", "DENSE_RANK() skips ranks; RANK() does not", "RANK() works only on integers; DENSE_RANK() works on strings", "They are interchangeable synonyms"],
    answer: 0,
    explanation: "RANK() counts the number of tied predecessors and skips rankings accordingly (1, 2, 2, 4). DENSE_RANK() assigns consecutive rank numbers without skipping (1, 2, 2, 3)."
  },
  {
    id: "sql-018",
    branch: "CSE",
    subject: "SQL",
    topic: "Basic Queries",
    difficulty: "Hard",
    question: "What is a Common Table Expression (CTE) defined using the 'WITH' clause?",
    options: ["A permanent database view stored on disk", "A temporary named result set defined within the execution scope of a single SELECT, INSERT, UPDATE, or DELETE statement", "A stored procedure compiled into machine code", "An in-memory hash index"],
    answer: 1,
    explanation: "A CTE is a temporary named result set specified by a WITH clause that simplifies complex queries and can even be referenced recursively (WITH RECURSIVE)."
  },
  {
    id: "sql-019",
    branch: "CSE",
    subject: "SQL",
    topic: "DDL & DML",
    difficulty: "Hard",
    question: "What does the clause 'ON DELETE CASCADE' specify on a Foreign Key definition?",
    options: ["Prevents deletion of rows in the parent table if references exist", "Automatically deletes the matching child rows whenever the referenced parent row is deleted", "Sets the child foreign key column to NULL upon parent deletion", "Triggers a database backup before deletion"],
    answer: 1,
    explanation: "ON DELETE CASCADE automatically propagates deletions: removing a row in the parent table triggers automatic deletion of all matching referencing rows in the child table."
  },
  {
    id: "sql-020",
    branch: "CSE",
    subject: "SQL",
    topic: "Constraints & Keys",
    difficulty: "Hard",
    question: "Why can creating too many indexes on a write-heavy OLTP table degrade overall system performance?",
    options: ["Indexes consume CPU cycles during reads", "Every INSERT, UPDATE, and DELETE statement requires updating not only the base table but also every associated index structure", "The database automatically disables tables with more than 3 indexes", "Indexes lock the database in read-only mode"],
    answer: 1,
    explanation: "While indexes accelerate SELECT queries, every write operation (INSERT/UPDATE/DELETE) forces the database engine to maintain and rebalance each index (B-tree splits, pointer adjustments), increasing write latency and I/O overhead."
  },

  // ==========================================
  // 5. DATA STRUCTURES (20 Questions: 8 Easy, 8 Medium, 4 Hard)
  // ==========================================
  {
    id: "ds-001",
    branch: "CSE",
    subject: "Data Structures",
    topic: "Arrays & Strings",
    difficulty: "Easy",
    question: "What is the time complexity to access an element at index i in a contiguous array?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"],
    answer: 0,
    explanation: "Arrays store elements in contiguous memory locations, allowing direct memory address calculation (base_address + i * element_size) in constant O(1) time."
  },
  {
    id: "ds-002",
    branch: "CSE",
    subject: "Data Structures",
    topic: "Stacks & Queues",
    difficulty: "Easy",
    question: "Which data structure follows the Last-In, First-Out (LIFO) access principle?",
    options: ["Queue", "Stack", "Priority Queue", "Deque"],
    answer: 1,
    explanation: "A Stack restricts insertion and removal to a single end (top), following the Last-In, First-Out (LIFO) discipline."
  },
  {
    id: "ds-003",
    branch: "CSE",
    subject: "Data Structures",
    topic: "Stacks & Queues",
    difficulty: "Easy",
    question: "Which data structure operates on the First-In, First-Out (FIFO) principle?",
    options: ["Queue", "Stack", "Binary Search Tree", "Max Heap"],
    answer: 0,
    explanation: "A standard Queue enqueues elements at the rear and dequeues them from the front, observing First-In, First-Out (FIFO) order."
  },
  {
    id: "ds-004",
    branch: "CSE",
    subject: "Data Structures",
    topic: "Linked Lists",
    difficulty: "Easy",
    question: "In a singly linked list, what reference does the 'next' pointer of the final (tail) node store?",
    options: ["The address of the head node", "NULL (or None)", "A pointer to itself", "A random memory address"],
    answer: 1,
    explanation: "In a non-circular singly linked list, the tail node's next pointer points to NULL, indicating the end of the sequence."
  },
  {
    id: "ds-005",
    branch: "CSE",
    subject: "Data Structures",
    topic: "Trees & BST",
    difficulty: "Easy",
    question: "What traversal order on a Binary Search Tree (BST) visits nodes in strictly ascending numerical order?",
    options: ["Pre-order (Root, Left, Right)", "In-order (Left, Root, Right)", "Post-order (Left, Right, Root)", "Level-order (BFS)"],
    answer: 1,
    explanation: "In a valid BST, all elements in the left subtree are smaller than the root, and all elements in the right subtree are greater. Hence, In-order traversal (Left, Root, Right) processes keys in ascending order."
  },
  {
    id: "ds-006",
    branch: "CSE",
    subject: "Data Structures",
    topic: "Trees & BST",
    difficulty: "Easy",
    question: "What is the maximum number of children any node can have in a binary tree?",
    options: ["1", "2", "3", "Unlimited"],
    answer: 1,
    explanation: "By definition, each node in a binary tree can have at most two child nodes (commonly designated as left child and right child)."
  },
  {
    id: "ds-007",
    branch: "CSE",
    subject: "Data Structures",
    topic: "Linked Lists",
    difficulty: "Easy",
    question: "What is a major advantage of a linked list over a static array?",
    options: ["O(1) random index access", "Dynamic size and efficient O(1) insertions/deletions at known positions without shifting elements", "Better cache locality", "Uses less memory per element"],
    answer: 1,
    explanation: "Linked lists grow or shrink dynamically at runtime and can insert or remove nodes in O(1) time once the node pointer is known, without shifting contiguous elements."
  },
  {
    id: "ds-008",
    branch: "CSE",
    subject: "Data Structures",
    topic: "Graphs",
    difficulty: "Easy",
    question: "Which data structure is typically used to implement Breadth-First Search (BFS) in a graph?",
    options: ["Stack", "Queue", "Max Heap", "Binary Search Tree"],
    answer: 1,
    explanation: "BFS explores nodes layer by layer using a FIFO Queue to ensure vertices are visited in order of their shortest distance from the source."
  },
  {
    id: "ds-009",
    branch: "CSE",
    subject: "Data Structures",
    topic: "Hashing & Heaps",
    difficulty: "Medium",
    question: "What is the worst-case time complexity of searching for an element in a Hash Table when many hash collisions occur?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    answer: 2,
    explanation: "While average lookup is O(1), if all n keys hash to the exact same bucket (worst-case collision), the bucket degenerates into a linear list taking O(n) search time."
  },
  {
    id: "ds-009b",
    branch: "CSE",
    subject: "Data Structures",
    topic: "Hashing & Heaps",
    difficulty: "Medium",
    question: "In a Max-Heap with n elements, what is the time complexity to extract the maximum element?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    answer: 1,
    explanation: "Extracting the max element removes the root in O(1) and replaces it with the last leaf, followed by a sift-down (heapify) operation taking O(log n) time."
  },
  {
    id: "ds-010",
    branch: "CSE",
    subject: "Data Structures",
    topic: "Linked Lists",
    difficulty: "Medium",
    question: "Which algorithm efficiently detects a cycle in a linked list using two pointers moving at different speeds?",
    options: ["Dijkstra's Algorithm", "Floyd's Cycle-Finding Algorithm (Tortoise and Hare)", "Kadane's Algorithm", "Kruskal's Algorithm"],
    answer: 1,
    explanation: "Floyd's algorithm uses a slow pointer advancing one step and a fast pointer advancing two steps. If a cycle exists, the fast pointer will eventually lap and meet the slow pointer in O(n) time and O(1) space."
  },
  {
    id: "ds-011",
    branch: "CSE",
    subject: "Data Structures",
    topic: "Stacks & Queues",
    difficulty: "Medium",
    question: "Which application is a classic use case for a Stack data structure?",
    options: ["Breadth-First Search", "Evaluating postfix (Reverse Polish) expressions and matching parentheses", "Printer spooling buffer", "Round-robin CPU scheduling"],
    answer: 1,
    explanation: "Parenthesis validation, function call execution stacks, undo/redo mechanisms, and postfix arithmetic evaluations rely on the LIFO behavior of stacks."
  },
  {
    id: "ds-012",
    branch: "CSE",
    subject: "Data Structures",
    topic: "Trees & BST",
    difficulty: "Medium",
    question: "What is the worst-case height and search time of an unbalanced Binary Search Tree with n nodes?",
    options: ["O(log n)", "O(n)", "O(1)", "O(n^2)"],
    answer: 1,
    explanation: "If elements are inserted in already sorted order, a standard BST degenerates into a linear linked list with height n - 1, causing search time to degrade to O(n)."
  },
  {
    id: "ds-013",
    branch: "CSE",
    subject: "Data Structures",
    topic: "Trees & BST",
    difficulty: "Medium",
    question: "What is the balance condition maintained by an AVL Tree for every node?",
    options: ["Left and right subtrees must have identical node counts", "The difference between heights of left and right subtrees (balance factor) must be at most 1 (-1, 0, or +1)", "The tree must be a complete binary tree", "All leaf nodes must be at the exact same depth"],
    answer: 1,
    explanation: "An AVL tree is a self-balancing BST where the balance factor (Height(Left) - Height(Right)) of any node is strictly restricted to {-1, 0, +1} through tree rotations."
  },
  {
    id: "ds-014",
    branch: "CSE",
    subject: "Data Structures",
    topic: "Graphs",
    difficulty: "Medium",
    question: "What is the space complexity of storing a graph with V vertices and E edges using an Adjacency Matrix?",
    options: ["O(V + E)", "O(V^2)", "O(E^2)", "O(V * E)"],
    answer: 1,
    explanation: "An adjacency matrix allocates a 2D array of size V × V to record edge connectivity, requiring O(V^2) space regardless of the number of edges E."
  },
  {
    id: "ds-015",
    branch: "CSE",
    subject: "Data Structures",
    topic: "Hashing & Heaps",
    difficulty: "Medium",
    question: "What is the time complexity to build a binary heap from an unsorted array of n elements using bottom-up heapify (Build-Heap)?",
    options: ["O(n log n)", "O(n)", "O(n^2)", "O(log n)"],
    answer: 1,
    explanation: "Although inserting n elements one-by-one takes O(n log n), bottom-up Build-Heap processes levels from bottom to top, summing a geometric series that converges to O(n)."
  },
  {
    id: "ds-016",
    branch: "CSE",
    subject: "Data Structures",
    topic: "Trees & BST",
    difficulty: "Hard",
    question: "What is the maximum number of rotations required to restore balance in an AVL tree after an insertion versus a deletion?",
    options: ["At most 2 rotations for insertion; up to O(log n) rotations for deletion", "O(log n) for both insertion and deletion", "At most 1 rotation for both", "Rotations are not used in AVL trees"],
    answer: 0,
    explanation: "After insertion, at most one single or double rotation (2 tree rotations) rebalances the tree and restores the original subtree height. For deletion, height reduction can cascade up the root, requiring up to O(log n) rotations."
  },
  {
    id: "ds-017",
    branch: "CSE",
    subject: "Data Structures",
    topic: "Trees & BST",
    difficulty: "Hard",
    question: "In a Red-Black Tree, which of the following properties is an invariant?",
    options: ["The root can be red", "Every red node must have two black children (no two consecutive red nodes on any simple path)", "The path from root to every leaf must have the same total number of nodes", "Leaves can be red"],
    answer: 1,
    explanation: "Red-Black invariants: 1. Every node is red or black. 2. Root is black. 3. Leaves (NIL) are black. 4. If a node is red, both children are black. 5. Every path from root to NIL leaves contains the exact same number of black nodes (black-height)."
  },
  {
    id: "ds-018",
    branch: "CSE",
    subject: "Data Structures",
    topic: "Hashing & Heaps",
    difficulty: "Hard",
    question: "What is a Trie (Prefix Tree) primarily optimized for?",
    options: ["Sorting floating-point numbers in descending order", "Fast prefix lookups, string searches, and autocomplete with time proportional to key length O(L)", "Finding shortest paths in negative-weight graphs", "Replacing relational databases for join queries"],
    answer: 1,
    explanation: "A Trie stores strings by character transitions along tree edges, allowing search, insertion, and prefix matching in O(L) time where L is the length of the string, independent of the total number of words n."
  },
  {
    id: "ds-019",
    branch: "CSE",
    subject: "Data Structures",
    topic: "Graphs",
    difficulty: "Hard",
    question: "What is the Disjoint Set Union (Union-Find) structure's amortized time per operation when implemented with union by rank and path compression?",
    options: ["O(log n)", "O(1)", "O(α(n)), where α is the inverse Ackermann function", "O(n)"],
    answer: 2,
    explanation: "Combining path compression with union by rank/size yields an amortized time per operation of O(α(n)), where α is the inverse Ackermann function (effectively ≤ 4 for all practical universe sizes)."
  },

  // ==========================================
  // 6. OPERATING SYSTEMS (20 Questions: 8 Easy, 8 Medium, 4 Hard)
  // ==========================================
  {
    id: "os-001",
    branch: "CSE",
    subject: "Operating Systems",
    topic: "Process Management",
    difficulty: "Easy",
    question: "What data structure does the operating system maintain to store all information about an active process?",
    options: ["Process Control Block (PCB)", "File Allocation Table (FAT)", "Inode Table", "Translation Lookaside Buffer (TLB)"],
    answer: 0,
    explanation: "The Process Control Block (PCB) contains the process state, program counter, CPU registers, CPU scheduling info, memory-management info, and accounting information."
  },
  {
    id: "os-002",
    branch: "CSE",
    subject: "Operating Systems",
    topic: "Process Management",
    difficulty: "Easy",
    question: "What is the key difference between a process and a thread?",
    options: ["Threads do not have program counters", "Threads within the same process share the same virtual address space and heap, while processes have isolated address spaces", "A process can run only on a single core", "Threads cannot be scheduled by the OS"],
    answer: 1,
    explanation: "Processes have separate memory spaces. Threads are lightweight units of execution within a process that share the code segment, data segment, and OS resources, but keep private stacks and registers."
  },
  {
    id: "os-003",
    branch: "CSE",
    subject: "Operating Systems",
    topic: "CPU Scheduling",
    difficulty: "Easy",
    question: "Which CPU scheduling algorithm gives each process a small fixed unit of CPU time (time quantum) in a cyclical queue?",
    options: ["First-Come, First-Served (FCFS)", "Shortest Job First (SJF)", "Round Robin (RR)", "Priority Scheduling"],
    answer: 2,
    explanation: "Round Robin (RR) allocates a fixed time quantum to each runnable process in FIFO order, preempting it when the quantum expires to provide fair interactive response times."
  },
  {
    id: "os-004",
    branch: "CSE",
    subject: "Operating Systems",
    topic: "Virtual Memory",
    difficulty: "Easy",
    question: "What hardware event occurs when a process attempts to access a virtual memory page that is not currently mapped into physical RAM?",
    options: ["Segmentation Fault", "Page Fault", "Bus Error", "Stack Overflow"],
    answer: 1,
    explanation: "A Page Fault is a hardware interrupt raised by the MMU when a program accesses a valid address whose page table entry has the present/valid bit set to 0, prompting the OS to fetch the page from disk."
  },
  {
    id: "os-005",
    branch: "CSE",
    subject: "Operating Systems",
    topic: "Synchronization & Deadlocks",
    difficulty: "Easy",
    question: "Which of the following is NOT one of the four Coffman conditions necessary for a deadlock to occur?",
    options: ["Mutual Exclusion", "Hold and Wait", "No Preemption", "Strict Alternation"],
    answer: 3,
    explanation: "The four Coffman conditions for deadlock are: 1. Mutual Exclusion, 2. Hold and Wait, 3. No Preemption, and 4. Circular Wait. 'Strict Alternation' is a synchronization technique, not a deadlock condition."
  },
  {
    id: "os-006",
    branch: "CSE",
    subject: "Operating Systems",
    topic: "Memory Management",
    difficulty: "Easy",
    question: "What is internal fragmentation in memory allocation?",
    options: ["Memory wasted because allocated block is slightly larger than the requested size", "Memory wasted between allocated blocks that cannot satisfy any new request", "Disk space wasted by deleted files", "Fragmentation caused by multi-threading"],
    answer: 0,
    explanation: "Internal fragmentation occurs when fixed-sized memory partitions allocate a block larger than requested; the unused space inside the allocated partition goes wasted."
  },
  {
    id: "os-007",
    branch: "CSE",
    subject: "Operating Systems",
    topic: "File Systems",
    difficulty: "Easy",
    question: "In Unix-like operating systems, what data structure stores file metadata such as permissions, ownership, size, and data block pointers?",
    options: ["Superblock", "Inode", "Directory block", "Boot record"],
    answer: 1,
    explanation: "An inode (index node) stores all metadata about a filesystem object (file/directory), except its name and the actual file content."
  },
  {
    id: "os-008",
    branch: "CSE",
    subject: "Operating Systems",
    topic: "Process Management",
    difficulty: "Easy",
    question: "What Unix system call is used by a parent process to create a new child process with a clone of the parent's address space?",
    options: ["exec()", "fork()", "spawn()", "clone_thread()"],
    answer: 1,
    explanation: "fork() creates an exact duplicate child process with separate copy-on-write memory address space, returning 0 to the child and the child's PID to the parent."
  },
  {
    id: "os-009",
    branch: "CSE",
    subject: "Operating Systems",
    topic: "CPU Scheduling",
    difficulty: "Medium",
    question: "What is the 'convoy effect' observed in CPU scheduling?",
    options: ["When multiple threads communicate simultaneously via sockets", "When short processes wait behind a long CPU-intensive process in First-Come First-Served (FCFS) scheduling, degrading average turnaround time", "When the CPU cache is flushed repeatedly", "When processes deadlock due to circular resource requests"],
    answer: 1,
    explanation: "In FCFS scheduling, if a long CPU-bound process holds the CPU, all subsequent short I/O-bound processes queue up behind it, leading to low device and CPU utilization."
  },
  {
    id: "os-010",
    branch: "CSE",
    subject: "Operating Systems",
    topic: "Synchronization & Deadlocks",
    difficulty: "Medium",
    question: "What is a counting semaphore with an initial value of 1 functionally equivalent to?",
    options: ["A barrier", "A binary semaphore (or mutex lock)", "A condition variable", "A read-write lock"],
    answer: 1,
    explanation: "A counting semaphore initialized to 1 can take only the values 0 and 1, functioning identically to a binary semaphore for mutual exclusion."
  },
  {
    id: "os-011",
    branch: "CSE",
    subject: "Operating Systems",
    topic: "Virtual Memory",
    difficulty: "Medium",
    question: "What is Belady's Anomaly in operating systems page replacement algorithms?",
    options: ["The phenomenon where increasing the number of physical page frames results in an INCREASE in the number of page faults for certain access strings under FIFO", "A kernel panic caused by hardware memory corruption", "When page tables exceed available RAM", "When LRU behaves worse than random replacement"],
    answer: 0,
    explanation: "Belady's Anomaly occurs specifically in the FIFO page replacement algorithm: allocating more page frames to a process can paradoxically lead to more page faults."
  },
  {
    id: "os-012",
    branch: "CSE",
    subject: "Operating Systems",
    topic: "Synchronization & Deadlocks",
    difficulty: "Medium",
    question: "Which algorithm is used for deadlock avoidance in an operating system when multiple instances of each resource type exist?",
    options: ["Banker's Algorithm", "Dijkstra's Shortest Path", "Peterson's Algorithm", "Bakery Algorithm"],
    answer: 0,
    explanation: "Dijkstra's Banker's Algorithm simulates resource allocation against maximum claim vectors to ensure the system remains in a safe state before granting requests."
  },
  {
    id: "os-013",
    branch: "CSE",
    subject: "Operating Systems",
    topic: "Virtual Memory",
    difficulty: "Medium",
    question: "What is 'thrashing' in virtual memory systems?",
    options: ["A high-speed disk defragmentation process", "A condition where the OS spends more time swapping pages in and out of disk than executing user instructions", "A memory leak caused by unclosed sockets", "Rapid switching between user and kernel mode"],
    answer: 1,
    explanation: "Thrashing occurs when the sum of active processes' working sets exceeds physical memory; page faults become so frequent that the CPU spends virtually all its time waiting for paging I/O."
  },
  {
    id: "os-014",
    branch: "CSE",
    subject: "Operating Systems",
    topic: "Virtual Memory",
    difficulty: "Medium",
    question: "What hardware cache is integrated into the MMU to accelerate virtual-to-physical address translation?",
    options: ["L1 instruction cache", "Translation Lookaside Buffer (TLB)", "Direct Memory Access (DMA) controller", "Branch Target Buffer (BTB)"],
    answer: 1,
    explanation: "The TLB is an associative high-speed hardware cache that stores recent virtual-to-physical page translation entries, avoiding multi-level page table traversals in RAM."
  },
  {
    id: "os-015",
    branch: "CSE",
    subject: "Operating Systems",
    topic: "Process Management",
    difficulty: "Medium",
    question: "What is a 'zombie process' in Unix?",
    options: ["A process running with root privileges continuously", "A process that has finished execution via exit(), but its entry remains in the process table because its parent has not yet read its exit status with wait()", "A process that cannot be killed even with SIGKILL", "A background daemon process without a controlling terminal"],
    answer: 1,
    explanation: "A zombie (defunct) process has terminated its execution but retains a PCB entry so its parent can inspect its termination status code using the wait() or waitpid() system call."
  },
  {
    id: "os-016",
    branch: "CSE",
    subject: "Operating Systems",
    topic: "Memory Management",
    difficulty: "Medium",
    question: "How does the Copy-On-Write (COW) optimization improve fork() performance?",
    options: ["It compresses the child process memory image", "Child and parent share the exact same physical pages initially; a private copy of a page is duplicated only when either process attempts to write to it", "It runs the child process entirely in kernel cache", "It disables write permissions on the hard disk"],
    answer: 1,
    explanation: "COW allows rapid fork() by mapping parent and child virtual pages to the same read-only physical frames, only allocating a new physical page when one process writes to that page."
  },
  {
    id: "os-017",
    branch: "CSE",
    subject: "Operating Systems",
    topic: "Synchronization & Deadlocks",
    difficulty: "Hard",
    question: "What three critical conditions must any correct solution to the Critical Section problem satisfy?",
    options: ["Mutual Exclusion, Progress, and Bounded Waiting", "Atomicity, Consistency, and Durability", "First-In First-Out, Priority, and Round Robin", "No Preemption, Hold and Wait, and Circular Wait"],
    answer: 0,
    explanation: "A valid critical section solution must ensure: 1. Mutual Exclusion (only one process at a time), 2. Progress (selection of next entrant cannot be postponed indefinitely), and 3. Bounded Waiting (limit on times others can enter before a request is granted)."
  },
  {
    id: "os-018",
    branch: "CSE",
    subject: "Operating Systems",
    topic: "Virtual Memory",
    difficulty: "Hard",
    question: "In an Inverted Page Table architecture, how is the table indexed?",
    options: ["Indexed by Virtual Page Number (VPN)", "Indexed by Physical Frame Number (PFN) with each entry storing the PID and VPN occupying that frame", "Indexed by Process ID (PID) alone", "Indexed by disk sector blocks"],
    answer: 1,
    explanation: "Unlike conventional per-process page tables indexed by VPN, an inverted page table contains one entry per physical frame in memory, dramatically reducing page table memory overhead on 64-bit systems."
  },
  {
    id: "os-019",
    branch: "CSE",
    subject: "Operating Systems",
    topic: "CPU Scheduling",
    difficulty: "Hard",
    question: "What is Priority Inversion, and what standard protocol is used in Real-Time Operating Systems (RTOS) to resolve it?",
    options: ["When high-priority processes monopolize the CPU; solved by Round Robin", "When a high-priority task is blocked waiting for a resource held by a low-priority task, while medium-priority tasks preempt the low one; solved by Priority Inheritance", "When user processes preempt kernel threads; solved by disabling interrupts", "When I/O bound tasks receive lower priority; solved by aging"],
    answer: 1,
    explanation: "Priority Inversion happens when a medium-priority task preempts a low-priority task holding a lock needed by a high-priority task. Priority Inheritance temporarily boosts the low-priority task's priority to match the high-priority task until the lock is released."
  },
  {
    id: "os-020",
    branch: "CSE",
    subject: "Operating Systems",
    topic: "Virtual Memory",
    difficulty: "Hard",
    question: "What is the Working Set Model proposed by Peter Denning for managing virtual memory?",
    options: ["A model that pre-loads all executable code into RAM at boot time", "An approximation of program locality that defines a process's working set as the set of pages referenced in the most recent Δ time units", "A file caching technique for network file systems", "A scheduling model that couples CPU affinity to memory chips"],
    answer: 1,
    explanation: "Denning's Working Set Model tracks the set of distinct pages accessed during a moving window of past time Δ. The OS allocates sufficient frames to each process to cover its working set, preventing thrashing."
  },

  // ==========================================
  // 7. COMPUTER NETWORKS (20 Questions: 8 Easy, 8 Medium, 4 Hard)
  // ==========================================
  {
    id: "cn-001",
    branch: "CSE",
    subject: "Computer Networks",
    topic: "OSI & TCP/IP",
    difficulty: "Easy",
    question: "How many layers are defined in the standard ISO-OSI Reference Model?",
    options: ["4", "5", "7", "8"],
    answer: 2,
    explanation: "The OSI model specifies 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, and Application."
  },
  {
    id: "cn-002",
    branch: "CSE",
    subject: "Computer Networks",
    topic: "Transport Layer (TCP/UDP)",
    difficulty: "Easy",
    question: "Which transport layer protocol provides connection-oriented, reliable, in-order byte-stream delivery with error checking?",
    options: ["UDP", "TCP", "ICMP", "IP"],
    answer: 1,
    explanation: "TCP (Transmission Control Protocol) is connection-oriented and provides reliable, in-order, flow-controlled, and congestion-controlled data delivery."
  },
  {
    id: "cn-003",
    branch: "CSE",
    subject: "Computer Networks",
    topic: "Transport Layer (TCP/UDP)",
    difficulty: "Easy",
    question: "What protocol is commonly preferred for real-time multiplayer gaming and live audio streaming due to low latency without retransmission delays?",
    options: ["TCP", "UDP", "FTP", "SMTP"],
    answer: 1,
    explanation: "UDP (User Datagram Protocol) does not incur handshakes, acknowledgments, or retransmissions, avoiding latency spikes in time-sensitive streaming and gaming."
  },
  {
    id: "cn-004",
    branch: "CSE",
    subject: "Computer Networks",
    topic: "Network Layer & IP",
    difficulty: "Easy",
    question: "What is the length of an IPv4 address compared to an IPv6 address?",
    options: ["IPv4 is 32 bits; IPv6 is 128 bits", "IPv4 is 64 bits; IPv6 is 128 bits", "IPv4 is 32 bits; IPv6 is 64 bits", "IPv4 is 128 bits; IPv6 is 256 bits"],
    answer: 0,
    explanation: "An IPv4 address is 32 bits (4 bytes) typically written in dotted-decimal format. An IPv6 address is 128 bits (16 bytes) written in hexadecimal colon notation."
  },
  {
    id: "cn-005",
    branch: "CSE",
    subject: "Computer Networks",
    topic: "Application Layer",
    difficulty: "Easy",
    question: "What is the primary role of the Domain Name System (DNS)?",
    options: ["To encrypt web traffic", "To translate human-readable domain names (like google.com) into numeric IP addresses", "To assign MAC addresses to network interfaces", "To route packets between autonomous systems"],
    answer: 1,
    explanation: "DNS acts as the phonebook of the Internet, resolving alphanumeric domain names into numerical IP addresses needed by underlying routing protocols."
  },
  {
    id: "cn-006",
    branch: "CSE",
    subject: "Computer Networks",
    topic: "Data Link Layer",
    difficulty: "Easy",
    question: "What is the length of an IEEE 802 MAC (Media Access Control) address?",
    options: ["32 bits", "48 bits (6 bytes)", "64 bits", "128 bits"],
    answer: 1,
    explanation: "A standard MAC address is 48 bits (6 octets) long, usually represented in hexadecimal format (e.g. 00:1A:2B:3C:4D:5E)."
  },
  {
    id: "cn-007",
    branch: "CSE",
    subject: "Computer Networks",
    topic: "Application Layer",
    difficulty: "Easy",
    question: "Which default TCP port is used for secure HTTPS web communication?",
    options: ["21", "25", "80", "443"],
    answer: 3,
    explanation: "Standard unencrypted HTTP operates on TCP port 80, whereas TLS-encrypted HTTPS operates on TCP port 443."
  },
  {
    id: "cn-008",
    branch: "CSE",
    subject: "Computer Networks",
    topic: "Network Layer & IP",
    difficulty: "Easy",
    question: "Which utility sends ICMP Echo Request messages to test IP network reachability between hosts?",
    options: ["traceroute", "ping", "netstat", "nslookup"],
    answer: 1,
    explanation: "The 'ping' utility relies on ICMP (Internet Control Message Protocol) Echo Request (Type 8) and Echo Reply (Type 0) to verify host connectivity and measure round-trip time."
  },
  {
    id: "cn-009",
    branch: "CSE",
    subject: "Computer Networks",
    topic: "Transport Layer (TCP/UDP)",
    difficulty: "Medium",
    question: "What is the correct sequence of control packets in the TCP Three-Way Handshake used to establish a connection?",
    options: ["SYN -> SYN-ACK -> ACK", "ACK -> SYN -> SYN-ACK", "SYN -> ACK -> DATA", "FIN -> FIN-ACK -> ACK"],
    answer: 0,
    explanation: "To establish a TCP session: 1. Client sends SYN (Synchronize). 2. Server responds with SYN-ACK (Synchronize-Acknowledge). 3. Client sends ACK (Acknowledge)."
  },
  {
    id: "cn-010",
    branch: "CSE",
    subject: "Computer Networks",
    topic: "Data Link Layer",
    difficulty: "Medium",
    question: "What protocol resolves an IP address into a corresponding physical MAC address on a local area network?",
    options: ["DNS", "ARP (Address Resolution Protocol)", "DHCP", "BGP"],
    answer: 1,
    explanation: "ARP (Address Resolution Protocol) broadcasts a query across the local subnet to map a target IPv4 address to its physical Layer-2 MAC address."
  },
  {
    id: "cn-011",
    branch: "CSE",
    subject: "Computer Networks",
    topic: "Network Layer & IP",
    difficulty: "Medium",
    question: "In CIDR notation, what does the subnet mask /26 correspond to in dotted-decimal format?",
    options: ["255.255.255.0", "255.255.255.128", "255.255.255.192", "255.255.255.224"],
    answer: 2,
    explanation: "A /26 mask has 26 consecutive '1' bits: 8 + 8 + 8 = 24 bits (255.255.255), and the fourth octet has two leading 1s: 128 + 64 = 192 (255.255.255.192)."
  },
  {
    id: "cn-012",
    branch: "CSE",
    subject: "Computer Networks",
    topic: "Network Layer & IP",
    difficulty: "Medium",
    question: "What is the purpose of Network Address Translation (NAT)?",
    options: ["To translate domain names to MAC addresses", "To allow multiple devices on a private local network to share a single public IP address", "To route packets using Dijkstra's algorithm", "To encrypt TCP headers"],
    answer: 1,
    explanation: "NAT enables devices with private IP addresses (e.g. 192.168.x.x) on an internal network to access the public Internet by translating private IP/port pairs to a routable public IP."
  },
  {
    id: "cn-013",
    branch: "CSE",
    subject: "Computer Networks",
    topic: "Transport Layer (TCP/UDP)",
    difficulty: "Medium",
    question: "What mechanism does TCP use for flow control to prevent a fast sender from overwhelming a slow receiver?",
    options: ["Three-way handshake", "Sliding window based on Receiver Window (rwnd)", "Exponential backoff", "Token bucket traffic shaping"],
    answer: 1,
    explanation: "TCP uses a dynamic sliding window where the receiver advertises its available buffer space (Receiver Window, rwnd) in acknowledgment headers, telling the sender how many bytes it can accept."
  },
  {
    id: "cn-014",
    branch: "CSE",
    subject: "Computer Networks",
    topic: "Network Layer & IP",
    difficulty: "Medium",
    question: "What happens to an IPv4 packet when its Time-To-Live (TTL) field reaches zero at an intermediate router?",
    options: ["It is forwarded with maximum priority", "The router drops the packet and sends an ICMP Time Exceeded message back to the source", "The packet is stored in NVRAM", "The router doubles the TTL value"],
    answer: 1,
    explanation: "To prevent packets from circulating endlessly in routing loops, each router decrements the TTL by 1. When TTL reaches 0, the packet is discarded and an ICMP Type 11 (Time Exceeded) message is returned."
  },
  {
    id: "cn-015",
    branch: "CSE",
    subject: "Computer Networks",
    topic: "Network Security",
    difficulty: "Medium",
    question: "In asymmetric public-key cryptography (such as RSA), which key is used to decrypt a ciphertext that was encrypted with Alice's public key?",
    options: ["Alice's public key", "Alice's private key", "Bob's public key", "A symmetric shared secret key"],
    answer: 1,
    explanation: "In asymmetric cryptography, data encrypted with a user's public key can strictly and mathematically only be decrypted by that user's corresponding private key."
  },
  {
    id: "cn-016",
    branch: "CSE",
    subject: "Computer Networks",
    topic: "Data Link Layer",
    difficulty: "Medium",
    question: "What collision-handling protocol is employed by traditional wired Ethernet (IEEE 802.3)?",
    options: ["CSMA/CA", "CSMA/CD (Carrier Sense Multiple Access with Collision Detection)", "Token Ring passing", "Slotted ALOHA"],
    answer: 1,
    explanation: "Wired Ethernet utilizes CSMA/CD: nodes listen to the medium before transmitting (carrier sense) and detect collisions during transmission, aborting and applying exponential backoff if a collision occurs."
  },
  {
    id: "cn-017",
    branch: "CSE",
    subject: "Computer Networks",
    topic: "Transport Layer (TCP/UDP)",
    difficulty: "Hard",
    question: "What are the four phases of TCP congestion control as defined in standard TCP Reno?",
    options: ["Listen, Syn, Connect, Terminate", "Slow Start, Congestion Avoidance, Fast Retransmit, and Fast Recovery", "Polling, Token, Contention, Routing", "Windowing, Sharding, Pacing, Filtering"],
    answer: 1,
    explanation: "TCP Reno implements Slow Start (exponential window growth), Congestion Avoidance (additive increase upon reaching ssthresh), Fast Retransmit (upon 3 duplicate ACKs), and Fast Recovery (halving cwnd instead of resetting to 1)."
  },
  {
    id: "cn-018",
    branch: "CSE",
    subject: "Computer Networks",
    topic: "Network Layer & IP",
    difficulty: "Hard",
    question: "What routing algorithm does the Open Shortest Path First (OSPF) interior gateway protocol use to calculate shortest path trees?",
    options: ["Bellman-Ford Distance Vector algorithm", "Dijkstra's Link-State algorithm", "Floyd-Warshall all-pairs algorithm", "BGP Path Vector algorithm"],
    answer: 1,
    explanation: "OSPF is a link-state routing protocol where routers flood link-state advertisements (LSAs) and execute Dijkstra's algorithm to compute the shortest-path tree to every destination."
  },
  {
    id: "cn-019",
    branch: "CSE",
    subject: "Computer Networks",
    topic: "Network Layer & IP",
    difficulty: "Hard",
    question: "What inter-domain routing protocol connects autonomous systems across the global Internet infrastructure?",
    options: ["RIP (Routing Information Protocol)", "OSPF", "BGP (Border Gateway Protocol)", "EIGRP"],
    answer: 2,
    explanation: "BGP is the de-facto Path Vector protocol that exchanges prefix reachability and AS-path attributes between autonomous systems (ASes) powering global Internet routing."
  },
  {
    id: "cn-020",
    branch: "CSE",
    subject: "Computer Networks",
    topic: "Network Security",
    difficulty: "Hard",
    question: "What security vulnerability does a SYN Flood attack exploit in the TCP stack?",
    options: ["Buffer overflow in the application layer", "Exhaustion of the server's half-open connection backlog queue (SYN queue) by sending numerous SYN packets and never sending the final ACK", "MAC address spoofing on the switch", "DNS cache poisoning"],
    answer: 1,
    explanation: "In a SYN Flood DoS attack, an attacker sends an overwhelming volume of SYN requests with forged source IPs. The server allocates TCB state in its backlog queue for each half-open connection until memory is exhausted."
  },

  // ==========================================
  // 8. MACHINE LEARNING (20 Questions: 8 Easy, 8 Medium, 4 Hard)
  // ==========================================
  {
    id: "ml-001",
    branch: "AIDS",
    subject: "Machine Learning",
    topic: "Supervised Learning",
    difficulty: "Easy",
    question: "What is the primary difference between supervised learning and unsupervised learning?",
    options: ["Supervised learning uses labeled training data, whereas unsupervised learning discovers patterns in unlabeled data", "Supervised learning requires GPU acceleration; unsupervised does not", "Unsupervised learning is used only for linear regression", "Supervised learning never suffers from overfitting"],
    answer: 0,
    explanation: "Supervised learning trains on input-output pairs with ground-truth target labels (classification/regression), whereas unsupervised learning uncovers intrinsic structure (clustering/dimensionality reduction) without target labels."
  },
  {
    id: "ml-002",
    branch: "AIDS",
    subject: "Machine Learning",
    topic: "Supervised Learning",
    difficulty: "Easy",
    question: "Predicting whether an email is 'Spam' or 'Not Spam' is an example of what type of machine learning task?",
    options: ["Continuous Regression", "Binary Classification", "Clustering", "Reinforcement Learning"],
    answer: 1,
    explanation: "Categorizing input into one of two discrete classes (Spam or Not Spam) is a classic binary classification problem."
  },
  {
    id: "ml-003",
    branch: "AIDS",
    subject: "Machine Learning",
    topic: "Unsupervised Learning",
    difficulty: "Easy",
    question: "Which of the following is a widely used algorithm for partitioning unlabeled data into k distinct clusters?",
    options: ["Logistic Regression", "K-Means Clustering", "Linear Support Vector Classifier", "Random Forest Regressor"],
    answer: 1,
    explanation: "K-Means is a standard centroid-based unsupervised clustering algorithm that iteratively assigns points to the nearest cluster centroid and updates centroids to the mean of assigned points."
  },
  {
    id: "ml-004",
    branch: "AIDS",
    subject: "Machine Learning",
    topic: "Evaluation Metrics",
    difficulty: "Easy",
    question: "What evaluation metric represents the ratio of correctly predicted instances to total instances in a classification problem?",
    options: ["Precision", "Recall", "Accuracy", "Mean Squared Error"],
    answer: 2,
    explanation: "Accuracy = (True Positives + True Negatives) / Total Predictions. It measures overall correctness across all classes."
  },
  {
    id: "ml-005",
    branch: "AIDS",
    subject: "Machine Learning",
    topic: "Overfitting & Regularization",
    difficulty: "Easy",
    question: "What does it mean when a machine learning model is 'overfitting'?",
    options: ["It performs poorly on both training and test data", "It performs exceptionally well on training data but generalizes poorly to unseen test data", "It trains too quickly", "It has too few model parameters"],
    answer: 1,
    explanation: "Overfitting occurs when a high-capacity model memorizes noise and sample-specific idiosyncrasies of the training set rather than the underlying distribution, causing high test error."
  },
  {
    id: "ml-006",
    branch: "AIDS",
    subject: "Machine Learning",
    topic: "Supervised Learning",
    difficulty: "Easy",
    question: "What function does Linear Regression seek to minimize to find the optimal line of best fit?",
    options: ["Cross-Entropy Loss", "Sum of Squared Errors (Residual Sum of Squares, RSS)", "Hinge Loss", "Kullback-Leibler Divergence"],
    answer: 1,
    explanation: "Ordinary Least Squares (OLS) linear regression finds coefficients that minimize the Sum of Squared Residuals (RSS) between true and predicted targets."
  },
  {
    id: "ml-007",
    branch: "AIDS",
    subject: "Machine Learning",
    topic: "Neural Networks Basics",
    difficulty: "Easy",
    question: "What is an activation function used for in an Artificial Neural Network?",
    options: ["To normalize the input file names", "To introduce non-linearity, allowing the network to learn complex non-linear decision boundaries", "To reset learning rate to zero", "To eliminate the need for training weights"],
    answer: 1,
    explanation: "Without non-linear activation functions (like ReLU, Sigmoid, or Tanh), stacking multiple linear layers would collapse mathematically into a single linear transformation."
  },
  {
    id: "ml-008",
    branch: "AIDS",
    subject: "Machine Learning",
    topic: "Evaluation Metrics",
    difficulty: "Easy",
    question: "In binary classification, what is a False Positive?",
    options: ["A negative instance correctly predicted as negative", "A negative instance incorrectly predicted as positive", "A positive instance incorrectly predicted as negative", "A positive instance correctly predicted as positive"],
    answer: 1,
    explanation: "A False Positive (Type I error) occurs when the model predicts the positive class, but the ground truth was actually negative."
  },
  {
    id: "ml-009",
    branch: "AIDS",
    subject: "Machine Learning",
    topic: "Evaluation Metrics",
    difficulty: "Medium",
    question: "In medical disease detection where missing an actual sick patient is dangerous, which metric should be prioritized to minimize False Negatives?",
    options: ["Precision", "Recall (Sensitivity)", "Specificity", "Mean Absolute Error"],
    answer: 1,
    explanation: "Recall = TP / (TP + FN). High recall ensures that the vast majority of actual positive cases are detected, minimizing life-threatening false negatives."
  },
  {
    id: "ml-010",
    branch: "AIDS",
    subject: "Machine Learning",
    topic: "Overfitting & Regularization",
    difficulty: "Medium",
    question: "What is the key difference between L1 Regularization (Lasso) and L2 Regularization (Ridge)?",
    options: ["L1 adds absolute penalty |w| causing coefficients to shrink to exactly zero (feature selection); L2 adds squared penalty w^2 shrinking weights smoothly without zeros", "L2 causes coefficients to become exactly zero; L1 does not", "L1 is used only for neural networks", "L2 cannot be used with gradient descent"],
    answer: 0,
    explanation: "L1 regularization uses the L1 norm penalty, driving less important weights to exactly 0 to produce sparse models. L2 uses the squared norm, penalizing large weights smoothly."
  },
  {
    id: "ml-011",
    branch: "AIDS",
    subject: "Machine Learning",
    topic: "Supervised Learning",
    difficulty: "Medium",
    question: "What does the Bias-Variance tradeoff dictate in machine learning models?",
    options: ["Models with high bias suffer from underfitting; models with high variance suffer from overfitting", "High bias always implies low training error", "Bias and variance can both be driven to absolute zero on noisy datasets", "Variance is independent of training sample size"],
    answer: 0,
    explanation: "High bias represents overly simplistic assumptions (underfitting), while high variance represents excessive sensitivity to small fluctuations in training data (overfitting). Total error = Bias^2 + Variance + Irreducible Error."
  },
  {
    id: "ml-012",
    branch: "AIDS",
    subject: "Machine Learning",
    topic: "Decision Trees & Ensembles",
    difficulty: "Medium",
    question: "How does a Random Forest model construct its ensemble of decision trees to achieve lower variance?",
    options: ["By training trees sequentially on previous residuals", "By using Bagging (Bootstrap Aggregating) on training data and selecting random subsets of features at each split", "By pruning all leaf nodes", "By using a single deep tree with multiple root nodes"],
    answer: 1,
    explanation: "Random Forest trains diverse decorrelated decision trees on bootstrap sample sets, while randomly selecting a subset of features at each split, averaging their predictions to reduce variance."
  },
  {
    id: "ml-013",
    branch: "AIDS",
    subject: "Machine Learning",
    topic: "Evaluation Metrics",
    difficulty: "Medium",
    question: "What does an Area Under the ROC Curve (AUC-ROC) score of 0.5 indicate?",
    options: ["A perfect classifier with zero error", "A classifier with performance equivalent to random guessing", "A classifier that only predicts the majority class", "A severe data leakage issue"],
    answer: 1,
    explanation: "An ROC curve plots True Positive Rate vs False Positive Rate across thresholds. A diagonal line with AUC = 0.5 corresponds to the discriminative capability of a random coin flip."
  },
  {
    id: "ml-014",
    branch: "AIDS",
    subject: "Machine Learning",
    topic: "Supervised Learning",
    difficulty: "Medium",
    question: "Why does the K-Nearest Neighbors (KNN) algorithm require feature scaling (normalization or standardization) before execution?",
    options: ["KNN requires all features to be normally distributed", "KNN computes distances (e.g. Euclidean distance) between data points; features with larger numerical ranges would disproportionately dominate the distance calculation", "KNN crashes if features are not between 0 and 1", "To speed up tree traversal"],
    answer: 1,
    explanation: "Because KNN relies on metric distances (like Euclidean or Manhattan), unscaled features with large numerical magnitudes (e.g. salary in thousands) would dwarf features with small scales (e.g. age in decades)."
  },
  {
    id: "ml-015",
    branch: "AIDS",
    subject: "Machine Learning",
    topic: "Neural Networks Basics",
    difficulty: "Medium",
    question: "What is the purpose of the Backpropagation algorithm in training Artificial Neural Networks?",
    options: ["To randomly shuffle training batches", "To compute gradients of the loss function with respect to every weight using the chain rule of calculus for gradient descent optimization", "To convert continuous outputs to categorical classes", "To initialize weights to zero"],
    answer: 1,
    explanation: "Backpropagation efficiently calculates the partial derivatives (gradients) of the cost function with respect to every weight in the network by applying the calculus chain rule from the output layer backward."
  },
  {
    id: "ml-016",
    branch: "AIDS",
    subject: "Machine Learning",
    topic: "Decision Trees & Ensembles",
    difficulty: "Medium",
    question: "What is the fundamental difference between Bagging and Boosting ensemble techniques?",
    options: ["Bagging trains models in parallel independently to reduce variance; Boosting trains models sequentially, where each new model focuses on correcting errors made by preceding models to reduce bias", "Boosting trains models in parallel; Bagging trains sequentially", "Bagging uses only neural networks", "Boosting does not use weights"],
    answer: 0,
    explanation: "Bagging (e.g. Random Forest) combines independent parallel models trained on bootstrap data to cut variance. Boosting (e.g. AdaBoost, XGBoost) iteratively trains weak learners sequentially to correct prior residual errors, reducing bias."
  },
  {
    id: "ml-017",
    branch: "AIDS",
    subject: "Machine Learning",
    topic: "Neural Networks Basics",
    difficulty: "Hard",
    question: "Why does the Vanishing Gradient Problem occur in deep neural networks when using Sigmoid activation functions?",
    options: ["Because the derivative of Sigmoid has a maximum value of 0.25; repeatedly multiplying fractions less than 1 during backpropagation causes gradients to shrink exponentially toward zero in early layers", "Because Sigmoid causes activation outputs to explode above 100", "Because Sigmoid cannot be differentiated", "Because Sigmoid outputs negative values"],
    answer: 0,
    explanation: "The derivative of σ(z) is σ(z)(1 - σ(z)), which peaks at 0.25. In deep architectures, chaining many terms ≤ 0.25 causes gradients propagating to early layers to diminish exponentially to near zero."
  },
  {
    id: "ml-018",
    branch: "AIDS",
    subject: "Machine Learning",
    topic: "Unsupervised Learning",
    difficulty: "Hard",
    question: "In Principal Component Analysis (PCA), how are the principal component directions mathematically determined from the data covariance matrix?",
    options: ["They are the eigenvectors corresponding to the largest eigenvalues of the covariance matrix", "They are random orthogonal projections", "They are calculated using K-means cluster centers", "They are the coefficients of logistic regression"],
    answer: 0,
    explanation: "PCA performs eigendecomposition on the centered data covariance matrix. The eigenvectors represent orthogonal axes of maximum variance (principal components), ordered by their eigenvalues."
  },
  {
    id: "ml-019",
    branch: "AIDS",
    subject: "Machine Learning",
    topic: "Supervised Learning",
    difficulty: "Hard",
    question: "What is the 'Kernel Trick' in Support Vector Machines (SVM)?",
    options: ["A technique to run SVM directly on GPU kernels", "A mathematical method to compute inner products in a high-dimensional feature space without explicitly transforming data points into that higher-dimensional space", "A method to eliminate support vectors from memory", "An algorithm to convert non-linear classification into linear regression"],
    answer: 1,
    explanation: "The Kernel Trick computes the dot product K(x, y) = <φ(x), φ(y)> directly using kernel functions (such as RBF or polynomial), allowing linear separation in infinite- or high-dimensional spaces without costly explicit coordinate transformations."
  },
  {
    id: "ml-020",
    branch: "AIDS",
    subject: "Machine Learning",
    topic: "Neural Networks Basics",
    difficulty: "Hard",
    question: "What problem does Batch Normalization solve during neural network training?",
    options: ["Internal Covariate Shift by standardizing layer inputs to have zero mean and unit variance across mini-batches", "Lack of labeled training data", "Overfitting caused by too few epochs", "GPU out-of-memory errors caused by large images"],
    answer: 0,
    explanation: "Batch Normalization normalizes the activations of each layer across the mini-batch to zero mean and unit variance (scaled by learnable γ and β), stabilizing distributions, mitigating vanishing gradients, and permitting higher learning rates."
  },

  // ==========================================
  // EXPANDED QUESTIONS BANK (Maximum 50 Support)
  // ==========================================
  // Java Expansion (java-021 to java-035)
  {
    id: "java-021",
    branch: "CSE",
    subject: "Java",
    topic: "Generics",
    difficulty: "Medium",
    question: "What is type erasure in Java generics?",
    options: ["The process where generic type parameters are replaced with their bounds or Object at compile time", "Deleting objects that have invalid generic types at runtime", "Forbidding primitive types as generic arguments", "A garbage collection optimization for generic collections"],
    answer: 0,
    explanation: "Type erasure removes all generic type information during compilation to ensure backward compatibility with older JVM versions that do not support generics."
  },
  {
    id: "java-022",
    branch: "CSE",
    subject: "Java",
    topic: "Concurrency",
    difficulty: "Medium",
    question: "What is the key difference between Runnable and Callable in Java?",
    options: ["Callable can return a value and throw checked exceptions, while Runnable cannot", "Runnable runs in a separate thread but Callable runs on the main thread", "Callable is synchronized whereas Runnable is asynchronous", "Runnable requires a ThreadPoolExecutor while Callable does not"],
    answer: 0,
    explanation: "Callable's call() method returns a generic V value and throws Exception, unlike Runnable's run() method which has a void return type and cannot throw checked exceptions."
  },
  {
    id: "java-023",
    branch: "CSE",
    subject: "Java",
    topic: "JVM",
    difficulty: "Hard",
    question: "Which garbage collector in modern Java is designed for low latency by executing most phases concurrently without long stop-the-world pauses?",
    options: ["Serial GC", "Parallel GC", "ZGC (Z Garbage Collector)", "Mark-Sweep-Compact GC"],
    answer: 2,
    explanation: "ZGC (and Shenandoah) are concurrent, low-latency garbage collectors in modern OpenJDK capable of sub-millisecond stop-the-world pauses even with multi-terabyte heaps."
  },
  {
    id: "java-024",
    branch: "CSE",
    subject: "Java",
    topic: "Streams",
    difficulty: "Easy",
    question: "Which of the following is a terminal operation in the Java Stream API?",
    options: ["filter()", "map()", "collect()", "distinct()"],
    answer: 2,
    explanation: "Terminal operations like collect(), count(), forEach(), and reduce() consume the stream and produce a non-stream result, triggering intermediate pipeline execution."
  },
  {
    id: "java-025",
    branch: "CSE",
    subject: "Java",
    topic: "OOP",
    difficulty: "Medium",
    question: "What occurs if you declare a constructor as private in a Java class?",
    options: ["The class cannot be instantiated from outside the class, enabling the Singleton or Utility pattern", "Compilation fails immediately", "The class is automatically converted to an interface", "Subclasses can still access it using super()"],
    answer: 0,
    explanation: "A private constructor prevents external classes and subclasses from creating direct instances, commonly used in Singletons, factories, and utility classes."
  },
  {
    id: "java-026",
    branch: "CSE",
    subject: "Java",
    topic: "Collections",
    difficulty: "Hard",
    question: "In Java 8+, how does HashMap handle collision degradation when a bucket exceeds 8 entries and the table size is at least 64?",
    options: ["Converts the bucket's linked list into a red-black balanced tree", "Throws a BucketOverflowException", "Rehashes the entire map into a quadratic probe table", "Discards older entries automatically"],
    answer: 0,
    explanation: "Java 8 converts linked list collision chains into balanced red-black trees (TreeNode) when threshold TREEIFY_THRESHOLD (8) is exceeded, improving worst-case search time from O(n) to O(log n)."
  },
  {
    id: "java-027",
    branch: "CSE",
    subject: "Java",
    topic: "Basics",
    difficulty: "Easy",
    question: "What is the memory size allocated to a primitive double in Java?",
    options: ["32 bits (4 bytes)", "64 bits (8 bytes)", "128 bits (16 bytes)", "Depends on the underlying CPU architecture"],
    answer: 1,
    explanation: "Java guarantees cross-platform uniformity: a primitive double is always 64 bits (8 bytes) adhering to the IEEE 754 standard."
  },
  {
    id: "java-028",
    branch: "CSE",
    subject: "Java",
    topic: "Exceptions",
    difficulty: "Medium",
    question: "Which of the following is an unchecked (Runtime) exception in Java?",
    options: ["NullPointerException", "IOException", "SQLException", "ClassNotFoundException"],
    answer: 0,
    explanation: "Subclasses of RuntimeException (such as NullPointerException, ArrayIndexOutOfBoundsException, IllegalArgumentException) are unchecked exceptions not required to be caught or declared."
  },

  // Python Expansion (py-021 to py-028)
  {
    id: "py-021",
    branch: "CSE",
    subject: "Python",
    topic: "OOP",
    difficulty: "Medium",
    question: "What does the @property decorator achieve in a Python class?",
    options: ["Allows a method to be accessed like an attribute with getters, setters, and deleters", "Marks the variable as private to the module", "Prevents subclasses from overriding the method", "Serializes the class instance to JSON"],
    answer: 0,
    explanation: "The @property decorator provides a pythonic way to define getter, setter, and deleter methods while exposing attribute-like syntax (obj.attr instead of obj.get_attr())."
  },
  {
    id: "py-022",
    branch: "CSE",
    subject: "Python",
    topic: "Memory",
    difficulty: "Hard",
    question: "How does Python handle circular reference garbage collection?",
    options: ["Using a cyclic garbage collector that periodically detects unreachable reference cycles across generation heaps", "It crashes with an OutOfMemoryError", "Reference counting alone handles cycles automatically", "Python does not allow circular references"],
    answer: 0,
    explanation: "While reference counting is Python's primary GC mechanism, a separate cyclic garbage collector runs periodically to detect and reclaim unreachable object reference cycles."
  },
  {
    id: "py-023",
    branch: "CSE",
    subject: "Python",
    topic: "Syntax",
    difficulty: "Easy",
    question: "What is the time complexity of looking up a key in a Python dict on average?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    answer: 0,
    explanation: "Python dictionaries are implemented using sparse hash tables, providing average O(1) time complexity for insertion, retrieval, and deletion."
  },
  {
    id: "py-024",
    branch: "CSE",
    subject: "Python",
    topic: "Data Structures",
    difficulty: "Medium",
    question: "What is the result of applying set union operation {1, 2} | {2, 3} in Python?",
    options: ["{1, 2, 3}", "{2}", "{1, 3}", "Error: bitwise OR not supported for sets"],
    answer: 0,
    explanation: "The pipe operator '|' on sets computes the set union, returning a new set containing all distinct elements from both sets: {1, 2, 3}."
  },
  {
    id: "py-025",
    branch: "CSE",
    subject: "Python",
    topic: "Concurrency",
    difficulty: "Hard",
    question: "Why does Python's threading module NOT achieve true parallel CPU execution on multi-core processors for CPU-bound tasks?",
    options: ["Because of the Global Interpreter Lock (GIL) serializing bytecode execution within a single OS process", "Because Python threads are green threads rather than OS threads", "Because Python lacks multi-core support in the standard library", "Because CPU-bound tasks are prohibited by Python's memory model"],
    answer: 0,
    explanation: "The GIL (Global Interpreter Lock) in CPython prevents multiple native threads from executing Python bytecodes concurrently, limiting CPU-bound speedup unless multiprocessing is used."
  },

  // DBMS Expansion (dbms-021 to dbms-028)
  {
    id: "dbms-021",
    branch: "CSE",
    subject: "DBMS",
    topic: "Transactions",
    difficulty: "Medium",
    question: "What is the write-ahead logging (WAL) protocol in database systems?",
    options: ["Log records describing changes must be flushed to non-volatile storage before the corresponding dirty data pages are written to disk", "All write queries must be logged in an audit table for security", "Writes are delayed until the transaction terminates", "Log records are written after all disk writes succeed"],
    answer: 0,
    explanation: "WAL ensures durability and atomicity by requiring that log records representing changes are written to disk before modified data pages are written to the database files."
  },
  {
    id: "dbms-022",
    branch: "CSE",
    subject: "DBMS",
    topic: "Concurrency Control",
    difficulty: "Hard",
    question: "In Two-Phase Locking (2PL), what characterizes the 'shrinking phase'?",
    options: ["Locks are released and no new locks can be acquired", "Locks are acquired and no locks can be released", "Database files are compacted to save space", "Transactions are aborted to resolve deadlock"],
    answer: 0,
    explanation: "In 2PL, once a transaction enters the shrinking phase and releases its first lock, it cannot acquire any further locks, guaranteeing serializability."
  },
  {
    id: "dbms-023",
    branch: "CSE",
    subject: "DBMS",
    topic: "Indexing",
    difficulty: "Easy",
    question: "What is the maximum number of clustered indexes permitted on a single database table?",
    options: ["Exactly 1", "Up to 16", "Unlimited", "Depends on the number of columns"],
    answer: 0,
    explanation: "A clustered index physically sorts and stores data rows in disk order based on the key; because data rows can only be sorted in one order, only one clustered index can exist per table."
  },
  {
    id: "dbms-024",
    branch: "CSE",
    subject: "DBMS",
    topic: "Normalization",
    difficulty: "Hard",
    question: "Which normal form addresses and eliminates multi-valued dependencies (MVDs)?",
    options: ["Fourth Normal Form (4NF)", "Third Normal Form (3NF)", "Boyce-Codd Normal Form (BCNF)", "Second Normal Form (2NF)"],
    answer: 0,
    explanation: "A relation is in 4NF if it is in BCNF and contains no non-trivial multi-valued dependencies (X ->> Y)."
  },

  // SQL Expansion (sql-021 to sql-028)
  {
    id: "sql-021",
    branch: "CSE",
    subject: "SQL",
    topic: "Window Functions",
    difficulty: "Hard",
    question: "What does the DENSE_RANK() window function do when two rows have identical order values?",
    options: ["Assigns the same rank without leaving gaps in the subsequent rank numbering", "Assigns different random ranks to break the tie", "Assigns the same rank and skips subsequent numbers (e.g. 1, 1, 3)", "Throws a SQL exception"],
    answer: 0,
    explanation: "Unlike RANK() which leaves gaps (e.g. 1, 1, 3), DENSE_RANK() produces consecutive rank numbers (e.g. 1, 1, 2) without skipping."
  },
  {
    id: "sql-022",
    branch: "CSE",
    subject: "SQL",
    topic: "Aggregation",
    difficulty: "Medium",
    question: "Which clause is specifically used to filter rows AFTER aggregate grouping in SQL?",
    options: ["HAVING", "WHERE", "ORDER BY", "GROUP FILTER"],
    answer: 0,
    explanation: "The WHERE clause filters individual rows before grouping, while the HAVING clause filters the aggregated group summaries."
  },
  {
    id: "sql-023",
    branch: "CSE",
    subject: "SQL",
    topic: "Joins",
    difficulty: "Easy",
    question: "What is the result of a CROSS JOIN between a table with 10 rows and a table with 5 rows?",
    options: ["50 rows (Cartesian product)", "15 rows", "5 rows", "10 rows"],
    answer: 0,
    explanation: "A CROSS JOIN produces a Cartesian product matching every row in the first table with every row in the second table: 10 * 5 = 50 rows."
  },
  {
    id: "sql-024",
    branch: "CSE",
    subject: "SQL",
    topic: "Subqueries",
    difficulty: "Medium",
    question: "What is a correlated subquery in SQL?",
    options: ["A subquery that references columns from the outer query and executes once for each candidate row evaluated by the outer query", "A subquery that runs once before the outer query executes", "A query joined with another table using UNION", "A subquery that creates temporary physical tables"],
    answer: 0,
    explanation: "A correlated subquery depends on data from the outer query, meaning it cannot be evaluated independently and is executed repeatedly for each outer row."
  },

  // DSA Expansion (dsa-021 to dsa-028)
  {
    id: "dsa-021",
    branch: "CSE",
    subject: "Data Structures & Algorithms",
    topic: "Graphs",
    difficulty: "Medium",
    question: "Which algorithm finds the single-source shortest paths in a weighted directed graph that may contain negative edge weights?",
    options: ["Bellman-Ford Algorithm", "Dijkstra's Algorithm", "Kruskal's Algorithm", "Prim's Algorithm"],
    answer: 0,
    explanation: "Bellman-Ford handles negative edge weights and detects negative weight cycles in O(V * E) time, whereas Dijkstra's algorithm fails with negative edge weights."
  },
  {
    id: "dsa-022",
    branch: "CSE",
    subject: "Data Structures & Algorithms",
    topic: "Dynamic Programming",
    difficulty: "Hard",
    question: "What is the time complexity of solving the 0/1 Knapsack problem using dynamic programming with n items and capacity W?",
    options: ["O(n * W)", "O(2^n)", "O(n log W)", "O(n + W)"],
    answer: 0,
    explanation: "The standard DP solution fills a 2D table of size (n+1) x (W+1), yielding a pseudo-polynomial time complexity of O(n * W)."
  },
  {
    id: "dsa-023",
    branch: "CSE",
    subject: "Data Structures & Algorithms",
    topic: "Trees",
    difficulty: "Easy",
    question: "What is the height of a complete binary tree with N nodes?",
    options: ["O(log N)", "O(N)", "O(N^2)", "O(1)"],
    answer: 0,
    explanation: "A complete binary tree has all levels completely filled except possibly the last, guaranteeing a logarithmic height of ⌊log2(N)⌋."
  },
  {
    id: "dsa-024",
    branch: "CSE",
    subject: "Data Structures & Algorithms",
    topic: "Sorting",
    difficulty: "Medium",
    question: "Which of the following sorting algorithms is NOT stable by default?",
    options: ["Quick Sort", "Merge Sort", "Insertion Sort", "Bubble Sort"],
    answer: 0,
    explanation: "Standard Quick Sort (with Lomuto or Hoare partitioning) swaps non-adjacent elements over long distances, disrupting the original relative order of equal keys."
  },

  // OS Expansion (os-021 to os-028)
  {
    id: "os-021",
    branch: "CSE",
    subject: "Operating Systems",
    topic: "Virtual Memory",
    difficulty: "Hard",
    question: "What is Belady's Anomaly in operating systems page replacement?",
    options: ["Allocating more physical page frames results in more page faults under FIFO replacement", "Thrashing caused by low CPU utilization", "A deadlock in the Translation Lookaside Buffer", "Infinite loops in LRU page stack management"],
    answer: 0,
    explanation: "Belady's Anomaly demonstrates that for some page access patterns using FIFO replacement, increasing the number of allocated page frames counterintuitively increases the total page faults."
  },
  {
    id: "os-022",
    branch: "CSE",
    subject: "Operating Systems",
    topic: "Deadlocks",
    difficulty: "Medium",
    question: "Which condition is NOT one of Coffman's four necessary conditions for deadlock?",
    options: ["Preemption allowed by kernel", "Mutual Exclusion", "Hold and Wait", "Circular Wait"],
    answer: 0,
    explanation: "The four necessary conditions for deadlock are: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait. If preemption is allowed, deadlock cannot occur."
  },
  {
    id: "os-023",
    branch: "CSE",
    subject: "Operating Systems",
    topic: "Scheduling",
    difficulty: "Easy",
    question: "Which CPU scheduling algorithm gives optimal average waiting time for a given set of processes?",
    options: ["Shortest Job First (SJF)", "First-Come First-Served (FCFS)", "Round Robin (RR)", "Priority Scheduling without preemption"],
    answer: 0,
    explanation: "Shortest Job First (SJF) is provably optimal for minimizing average waiting time because scheduling the shortest process first moves subsequent processes ahead faster."
  },
  {
    id: "os-024",
    branch: "CSE",
    subject: "Operating Systems",
    topic: "Memory Management",
    difficulty: "Medium",
    question: "What is external fragmentation in memory management?",
    options: ["Total memory space exists to satisfy a request, but it is not contiguous", "Memory allocated to a process is larger than requested memory", "Page table entries pointing to invalid swap files", "Cache misses in L1 and L2 caches"],
    answer: 0,
    explanation: "External fragmentation occurs in dynamic partitioning when free memory is broken into many small, non-contiguous blocks that cannot accommodate larger incoming processes."
  },

  // Computer Networks Expansion (cn-021 to cn-028)
  {
    id: "cn-021",
    branch: "CSE",
    subject: "Computer Networks",
    topic: "Transport Layer",
    difficulty: "Medium",
    question: "In TCP flow control, what mechanism prevents the sender from overwhelming the receiver's buffer?",
    options: ["Sliding window advertised in TCP segment headers", "Hop-by-hop packet dropping", "Random early detection (RED)", "IP TTL decrements"],
    answer: 0,
    explanation: "TCP flow control is governed by the receiver advertising its remaining buffer capacity (receive window or rwnd) in acknowledgment headers, throttling the sender."
  },
  {
    id: "cn-022",
    branch: "CSE",
    subject: "Computer Networks",
    topic: "Routing",
    difficulty: "Hard",
    question: "Which routing protocol uses the Dijkstra shortest path algorithm and is classified as a Link-State protocol?",
    options: ["OSPF (Open Shortest Path First)", "RIP (Routing Information Protocol)", "BGP (Border Gateway Protocol)", "EGP (Exterior Gateway Protocol)"],
    answer: 0,
    explanation: "OSPF is an interior gateway link-state protocol where every router floods link-state advertisements and calculates the shortest path tree using Dijkstra's algorithm."
  },
  {
    id: "cn-023",
    branch: "CSE",
    subject: "Computer Networks",
    topic: "Subnetting",
    difficulty: "Easy",
    question: "How many usable host IP addresses are provided by a /28 IPv4 subnet?",
    options: ["14", "16", "30", "32"],
    answer: 0,
    explanation: "A /28 subnet has 32 - 28 = 4 host bits: 2^4 = 16 total addresses. Subtracting the network address and broadcast address yields 16 - 2 = 14 usable host IPs."
  },
  {
    id: "cn-024",
    branch: "CSE",
    subject: "Computer Networks",
    topic: "Application Layer",
    difficulty: "Medium",
    question: "What major multiplexing capability does HTTP/2 introduce over HTTP/1.1?",
    options: ["Interleaved binary framing over a single TCP connection avoiding head-of-line blocking at the application layer", "Elimination of TCP in favor of UDP", "Deprecation of SSL/TLS certificates", "Automatic client-side load balancing"],
    answer: 0,
    explanation: "HTTP/2 breaks requests and responses into independent binary frames and multiplexes them bidirectionally across a single persistent TCP connection, preventing HTTP-level head-of-line blocking."
  },

  // Machine Learning Expansion (ml-021 to ml-028)
  {
    id: "ml-021",
    branch: "AIDS",
    subject: "Machine Learning",
    topic: "Regularization",
    difficulty: "Medium",
    question: "How does L1 regularization (Lasso) differ fundamentally from L2 regularization (Ridge)?",
    options: ["L1 penalty drives feature weights strictly to zero, performing automatic feature selection", "L2 penalty eliminates features completely", "L1 is only applicable to neural networks", "L2 cannot prevent overfitting"],
    answer: 0,
    explanation: "L1 regularization adds the sum of absolute weights to the loss function (|w|), creating sharp corners on constraint contours that force less important coefficients exactly to zero."
  },
  {
    id: "ml-022",
    branch: "AIDS",
    subject: "Machine Learning",
    topic: "Evaluation Metrics",
    difficulty: "Medium",
    question: "In an imbalanced fraud detection dataset where fraudulent cases are 0.1%, which metric is LEAST informative for model evaluation?",
    options: ["Accuracy", "Precision", "Recall", "Area under PR Curve (PR-AUC)"],
    answer: 0,
    explanation: "A naive model predicting 'no fraud' for all samples achieves 99.9% accuracy while catching zero fraud cases, rendering raw accuracy misleading for highly skewed classes."
  },
  {
    id: "ml-023",
    branch: "AIDS",
    subject: "Machine Learning",
    topic: "Neural Networks",
    difficulty: "Hard",
    question: "Why does the ReLU (Rectified Linear Unit) activation function alleviate the vanishing gradient problem compared to Sigmoid?",
    options: ["The derivative of ReLU is 1 for positive inputs, maintaining constant gradient flow without saturation", "ReLU outputs values strictly bounded between 0 and 1", "ReLU is differentiable everywhere including zero", "ReLU normalizes layer weights automatically"],
    answer: 0,
    explanation: "Sigmoid derivatives max out at 0.25 and saturate near 0 for extreme values, causing exponential gradient decay across deep layers. ReLU has a constant derivative of 1 for x > 0."
  },
  {
    id: "ml-024",
    branch: "AIDS",
    subject: "Machine Learning",
    topic: "Unsupervised Learning",
    difficulty: "Easy",
    question: "In K-Means clustering, what does the 'Elbow Method' help determine?",
    options: ["The optimal number of clusters (K)", "The convergence threshold for centroids", "The learning rate for gradient descent", "The optimal number of PCA components"],
    answer: 0,
    explanation: "The Elbow Method plots the Within-Cluster Sum of Squares (WCSS) against values of K; the 'elbow' point indicates diminishing returns where adding more clusters yields marginal variance reduction."
  }
];

if (typeof window !== "undefined") {
  window.RAW_QUESTIONS = RAW_QUESTIONS;
}

