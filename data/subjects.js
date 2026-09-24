/**
 * EngiQuiz - Engineering Branches and Subjects
 * Learn. Practice. Improve.
 */

const BRANCHES = {
  CSE: {
    id: "CSE",
    name: "Computer Science & IT",
    icon: "bi-laptop",
    color: "#6f42c1"
  },
  AIDS: {
    id: "AIDS",
    name: "AI & Data Science",
    icon: "bi-cpu",
    color: "#0d6efd"
  },
  ECE: {
    id: "ECE",
    name: "Electronics & Communication",
    icon: "bi-broadcast-pin",
    color: "#0dcaf0"
  },
  EEE: {
    id: "EEE",
    name: "Electrical & Electronics",
    icon: "bi-lightning-charge",
    color: "#ffc107"
  },
  MECH: {
    id: "MECH",
    name: "Mechanical Engineering",
    icon: "bi-gear-wide-connected",
    color: "#fd7e14"
  },
  CIVIL: {
    id: "CIVIL",
    name: "Civil Engineering",
    icon: "bi-buildings",
    color: "#198754"
  }
};

const SUBJECTS = [
  // Computer Science & IT
  {
    id: "java",
    name: "Java",
    branch: "CSE",
    icon: "bi-cup-hot",
    description: "Core Java, Object-Oriented Programming, Collections, Multithreading & Exception Handling.",
    topics: ["Basics", "OOP", "Collections", "Exception Handling", "Multithreading", "Memory Management"]
  },
  {
    id: "python",
    name: "Python",
    branch: "CSE",
    icon: "bi-filetype-py",
    description: "Syntax, Data Structures, OOP, Functional Concepts, Modules, and Python Internals.",
    topics: ["Basics", "Data Structures", "Functions & Scopes", "OOP", "Exceptions & File I/O", "Generators & Decorators"]
  },
  {
    id: "dbms",
    name: "DBMS",
    branch: "CSE",
    icon: "bi-database",
    description: "Relational Models, ER Diagrams, Normalization, ACID Transactions, and Concurrency Control.",
    topics: ["ER Model", "Relational Algebra", "Normalization", "Transactions & ACID", "Indexing & Hashing", "Concurrency"]
  },
  {
    id: "sql",
    name: "SQL",
    branch: "CSE",
    icon: "bi-table",
    description: "Queries, Joins, Aggregations, Subqueries, Constraints, Views, and Indexing.",
    topics: ["Basic Queries", "Joins", "Aggregation & Grouping", "Subqueries", "Constraints & Keys", "DDL & DML"]
  },
  {
    id: "data-structures",
    name: "Data Structures",
    branch: "CSE",
    icon: "bi-diagram-3",
    description: "Arrays, Linked Lists, Stacks, Queues, Trees, Binary Search Trees, Heaps, and Graphs.",
    topics: ["Arrays & Strings", "Linked Lists", "Stacks & Queues", "Trees & BST", "Graphs", "Hashing & Heaps"]
  },
  {
    id: "operating-systems",
    name: "Operating Systems",
    branch: "CSE",
    icon: "bi-motherboard",
    description: "Processes, Threads, CPU Scheduling, Deadlocks, Memory Management, and Virtual Memory.",
    topics: ["Process Management", "CPU Scheduling", "Synchronization & Deadlocks", "Memory Management", "Virtual Memory", "File Systems"]
  },
  {
    id: "computer-networks",
    name: "Computer Networks",
    branch: "CSE",
    icon: "bi-router",
    description: "OSI & TCP/IP Reference Models, IP Addressing, Routing Protocols, Transport Layer, and Network Security.",
    topics: ["OSI & TCP/IP", "Data Link Layer", "Network Layer & IP", "Transport Layer (TCP/UDP)", "Application Layer", "Network Security"]
  },
  {
    id: "algorithms",
    name: "Algorithms",
    branch: "CSE",
    icon: "bi-code-square",
    description: "Asymptotic Analysis, Divide & Conquer, Greedy Algorithms, Dynamic Programming, and Graph Traversals.",
    topics: ["Asymptotic Analysis", "Divide & Conquer", "Greedy Approach", "Dynamic Programming", "Graph Algorithms", "Backtracking"]
  },
  {
    id: "c-prog",
    name: "C Programming",
    branch: "CSE",
    icon: "bi-file-earmark-code",
    description: "Pointers, Memory Allocation, Structures, Arrays, Macros, and File Handling.",
    topics: ["Basics & Syntax", "Pointers & Memory", "Arrays & Strings", "Structures & Unions", "File I/O"]
  },
  {
    id: "cpp",
    name: "C++",
    branch: "CSE",
    icon: "bi-filetype-tsx",
    description: "OOP in C++, Templates, STL Containers, Memory Management, and Operator Overloading.",
    topics: ["OOP Concepts", "Constructors & Destructors", "STL & Templates", "Virtual Functions", "Pointers & References"]
  },
  {
    id: "web-dev",
    name: "Web Development",
    branch: "CSE",
    icon: "bi-globe",
    description: "HTML5, CSS3, DOM Manipulation, JavaScript ES6+, HTTP Methods, and Web Security.",
    topics: ["HTML & Semantic Elements", "CSS & Box Model", "JavaScript ES6+", "DOM & Events", "HTTP & REST"]
  },

  // AI & Data Science
  {
    id: "machine-learning",
    name: "Machine Learning",
    branch: "AIDS",
    icon: "bi-robot",
    description: "Supervised & Unsupervised Learning, Regression, Classification, Clustering, and Model Evaluation.",
    topics: ["Supervised Learning", "Unsupervised Learning", "Evaluation Metrics", "Overfitting & Regularization", "Decision Trees & Ensembles", "Neural Networks Basics"]
  },
  {
    id: "artificial-intelligence",
    name: "Artificial Intelligence",
    branch: "AIDS",
    icon: "bi-brain",
    description: "Search Algorithms, Heuristics, Knowledge Representation, Game Playing, and Expert Systems.",
    topics: ["Search Strategies", "Heuristic Search (A*)", "Adversarial Search", "Knowledge Representation", "Probabilistic Reasoning"]
  },
  {
    id: "deep-learning",
    name: "Deep Learning",
    branch: "AIDS",
    icon: "bi-boxes",
    description: "Artificial Neural Networks, Backpropagation, CNNs, RNNs, and Optimization Algorithms.",
    topics: ["Perceptrons & ANNs", "Backpropagation & Loss", "CNN Architectures", "RNN & LSTM", "Transformers Basics"]
  },

  // ECE
  {
    id: "digital-electronics",
    name: "Digital Electronics",
    branch: "ECE",
    icon: "bi-toggles",
    description: "Boolean Algebra, Logic Gates, Combinational Circuits, Flip-Flops, Counters, and Registers.",
    topics: ["Boolean Algebra & K-Maps", "Logic Gates", "Combinational Circuits", "Sequential Circuits & Flip-Flops", "Counters & Registers"]
  },
  {
    id: "communication-systems",
    name: "Communication Systems",
    branch: "ECE",
    icon: "bi-reception-4",
    description: "Analog Modulation (AM/FM), Digital Modulation (PCM, ASK, FSK, PSK), and Noise Analysis.",
    topics: ["Amplitude Modulation", "Frequency Modulation", "Digital Modulation", "Sampling & Quantization", "Noise & Information Theory"]
  },

  // EEE
  {
    id: "electrical-circuits",
    name: "Electrical Circuits",
    branch: "EEE",
    icon: "bi-plug",
    description: "Kirchhoff's Laws, Network Theorems, AC Circuit Analysis, Resonance, and Transient Response.",
    topics: ["KCL & KVL", "Network Theorems", "AC Circuit Analysis", "Resonance & Filters", "Two-Port Networks"]
  },
  {
    id: "control-systems",
    name: "Control Systems",
    branch: "EEE",
    icon: "bi-sliders",
    description: "Transfer Functions, Block Diagrams, Routh-Hurwitz Stability, Root Locus, and Bode Plots.",
    topics: ["Mathematical Modeling", "Time-Domain Analysis", "Stability & Routh Criterion", "Root Locus", "Frequency Domain & Bode Plots"]
  },

  // Mechanical
  {
    id: "thermodynamics",
    name: "Thermodynamics",
    branch: "MECH",
    icon: "bi-thermometer-half",
    description: "Laws of Thermodynamics, Heat Engines, Carnot Cycle, Entropy, and Pure Substances.",
    topics: ["Zeroth & First Law", "Second Law & Entropy", "Thermodynamic Cycles", "Steam & Pure Substances", "Gas Dynamics"]
  },
  {
    id: "engineering-mechanics",
    name: "Engineering Mechanics",
    branch: "MECH",
    icon: "bi-wrench",
    description: "Statics, Force Systems, Equilibrium, Centroids, Friction, and Dynamics of Rigid Bodies.",
    topics: ["Force Systems & Equilibrium", "Friction", "Centroid & Moment of Inertia", "Kinematics", "Kinetics & Work-Energy"]
  },

  // Civil
  {
    id: "structural-engineering",
    name: "Structural Engineering",
    branch: "CIVIL",
    icon: "bi-bricks",
    description: "Stress, Strain, Bending Moment, Shear Force Diagrams, and Deflection of Beams.",
    topics: ["Stress & Strain", "Shear Force & Bending Moment", "Bending & Shear Stresses", "Torsion & Deflection", "Columns & Trusses"]
  },
  {
    id: "surveying",
    name: "Surveying",
    branch: "CIVIL",
    icon: "bi-geo-alt",
    description: "Chain Surveying, Compass Surveying, Levelling, Theodolite, and Modern Geomatics.",
    topics: ["Principles of Surveying", "Chain & Compass Surveying", "Levelling & Contouring", "Theodolite & Tachometry", "Total Station & GPS"]
  }
];

if (typeof window !== "undefined") {
  window.BRANCHES = BRANCHES;
  window.SUBJECTS = SUBJECTS;
}
