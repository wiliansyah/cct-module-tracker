import { useState, useMemo, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  Upload, 
  BookOpen,
  Building2,
  Search,
  X,
  RefreshCw,
  Download,
  Save,
  FileSpreadsheet,
  CheckCircle2,
  Filter,
  Lock,
  TableProperties,
  Check,
  ChevronDown,
  FilePlus2,
  FileEdit,
  ShieldCheck,
  ExternalLink,
  History,
  Activity,
  Eye,
  EyeOff,
  Users
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';

/**
 * FIREBASE CONFIGURATION (PRODUCTION)
 */
const firebaseConfig = {
  apiKey: "AIzaSyAgZUtc5aZguYz_MW5zISkuLvDgPmDixfg",
  authDomain: "meratus-frd-lms-10276.firebaseapp.com",
  projectId: "meratus-frd-lms-10276",
  storageBucket: "meratus-frd-lms-10276.firebasestorage.app",
  messagingSenderId: "845694770386",
  appId: "1:845694770386:web:f103c31b21d082c8fd610b",
  measurementId: "G-KEV4HZQ53M"
};

const app = initializeApp(firebaseConfig);
getAnalytics(app); 
const auth = getAuth(app);
const db = getFirestore(app);

const DEFAULT_TSV = `No\tNama Module\tStatus\tGroup SBU/SFU\tLink Terbaru\tLink File Lama
1\tAction Tracker 2023\tUnchanged\t\t\t
2\tAI Workshop - AI Implementation & Use Cases\tUnchanged\t\t\t
3\tAI Workshop - Understanding the AI Landscape 2024\tUnchanged\t\t\t
4\tAsset & Charter - Basic Understanding Marine Insurance\tUnchanged\t\t\t
5\tAsset & Charter - Chartering Operations\tUnchanged\t\t\t
6\tAsset & Charter - Digital Inspection and Documentation Software\tUnchanged\t\t\t
7\tAsset & Charter - IMO Regulation: SOLAS\tUnchanged\t\t\t
8\tAsset & Charter - Inspeksi QSHE Alat Berat Depo\tUnchanged\t\t\t
9\tAsset & Charter - Inspeksi QSHE Alat Berat Terminal\tUnchanged\t\t\t
10\tAsset & Charter - Inspeksi QSHE Operational Trucking MJT\tUnchanged\t\t\t
11\tAsset & Charter - Inspeksi QSHE Repair Container\tUnchanged\t\t\t
12\tAsset & Charter - Inspeksi QSHE Warehouse\tUnchanged\t\t\t
13\tAsset & Charter - Introduction to Asset & Charter Business\tUnchanged\t\t\t
14\tAsset & Charter - Introduction to Chartering\tUnchanged\t\t\t
15\tAsset & Charter - ISO 9001:2015\tUnchanged\t\t\t
16\tAsset & Charter - Lifting Cargoes on Flat Rack Container\tUnchanged\t\t\t
17\tAsset & Charter - Non Vessel Asset Management (Truck & Trailer)\tUnchanged\t\t\t
18\tAsset & Charter - Non Vessel: Risk Classification & Measurement\tUnchanged\t\t\t
19\tAsset & Charter - Pemahaman SMS melalui QSHE Barriers\tUnchanged\t\t\t
20\tAsset & Charter - Standar Pedoman Implementasi QSHE Non Vessel\tUnchanged\t\t\t
21\tAsset Charter: IMO Regulation - Marine Pollution (MARPOL)\tUnchanged\t\t\t
22\tBA - Asset & Charter: Introduction to QSHE Meratus\tUnchanged\t\t\t
23\tBA - CLC: Container Repair Process\tUnchanged\t\t\t
24\tBA - CLC: MLO Depot Business & Marketing Strategy\tUnchanged\t\t\t
25\tBA - CLC: Receiving Delivery and Stuffing Stripping Process at Depo\tUnchanged\t\t\t
26\tBA - Liner: Basic Container\tUnchanged\t\t\t
27\tBA - Liner: Basic Knowledge Terminal Operation\tUnchanged\t\t\t
28\tBA - Liner: Introduction to MFEC\tUnchanged\t\t\t
29\tBA - Liner: Product Knowledge Meratus Liner\tUnchanged\t\t\t
30\tBA - Liner: Service Excellence\tUnchanged\t\t\t
31\tBA - Liner: Term of Shipment\tUnchanged\t\t\t
32\tBA - Logistics: Basic Knowledge Reefer\tUnchanged\t\t\t
33\tBA - Logistics: Customs Clearance\tUnchanged\t\t\t
34\tBA - Logistics: Sea Freight Domestic\tUnchanged\t\t\t
35\tBA - Logistics: Warehouse & Transport\tUnchanged\t\t\t
36\tBA - MSM: Introduction to Ship Management\tUnchanged\t\t\t
37\tBA - MTM: Heavy Equipment Maintenance\tUnchanged\t\t\t
38\tBasic CLC - Terminal : Basic Knowledge Business Process CLC & Terminal\tUnchanged\t\t\t
39\tBasic CLC : Depo Management\tUnchanged\t\t\t
40\tBasic CLC : Heavy Equipment\tUnchanged\t\t\t
41\tBasic CLC : Pengetahuan Bongkar Muat\tUnchanged\t\t\t
42\tBasic CLC : Repair Container\tUnchanged\t\t\t
43\tBasic CLC: Penyerahan dan Penerimaan Kontainer\tUnchanged\t\t\t
44\tBasic English - 16 Basic Tenses\tUnchanged\t\t\t
45\tBasic English - Email Writing\tUnchanged\t\t\t
46\tBasic English - Negotiation Skills\tUnchanged\t\t\t
47\tBasic English - Preposition of Time\tUnchanged\t\t\t
48\tBasic English - Presentation Skills\tUnchanged\t\t\t
49\tBasic Excel Function\tUnchanged\t\t\t
50\tBasic Logistic : HS Code dan Kepabeanan\tUnchanged\t\t\t
51\tBasic Logistic : Reefer Container Handling\tUnchanged\t\t\t
52\tBasic Logistics - Commercial : Account Plan\tUnchanged\t\t\t
53\tBasic Logistics - Commercial : Basic Agency & International Service\tUnchanged\t\t\t
54\tBasic Logistics - Commercial : Incoterms Logistics\tUnchanged\t\t\t
55\tBasic Logistics - Commercial : Sales Skills\tUnchanged\t\t\t
56\tBasic Logistics - Commercial: Exim dan Incoterms\tUnchanged\t\t\t
57\tBasic Logistics - Operations: Operation Monitoring & System Support\tUnchanged\t\t\t
58\tBasic Logistics - Operations: SCM Profit\tUnchanged\t\t\t
59\tBasic Logistics - P3W Sales\tUnchanged\t\t\t
60\tBasic Logistics : Account Receivable\tUnchanged\t\t\t
61\tBasic Logistics : Airfreight\tUnchanged\t\t\t
62\tBasic Logistics : Basic Knowledge Business Process Logistics\tUnchanged\t\t\t
63\tBasic Logistics : Basic LCL (Less than Container Load)\tUnchanged\t\t\t
64\tBasic Logistics : Basic Operation\tUnchanged\t\t\t
65\tBasic Logistics : Custom Clearence\tUnchanged\t\t\t
66\tBasic Logistics : Customer Service\tUnchanged\t\t\t
67\tBasic Logistics : Industrial Project\tUnchanged\t\t\t
68\tBasic Logistics : Pemahaman Klaim & Asuransi\tUnchanged\t\t\t
69\tBasic Logistics : Quality Management System\tUnchanged\t\t\t
70\tBasic Logistics : Sea Freight\tUnchanged\t\t\t
71\tBasic Logistics : Warehouse & Transport\tUnchanged\t\t\t
72\tBasic Logistics: Vendor Management\tUnchanged\t\t\t
73\tBasic Operation : 3. Port Info & Ship Particular\tUnchanged\t\t\t
74\tBasic Operation : 4. Loading & Unloading\tUnchanged\t\t\t
75\tBasic Operation : 9. IMDG Code\tUnchanged\t\t\t
76\tBasic Operation: 5. Container Inventory Management\tUnchanged\t\t\t
77\tBasic Public Speaking Skills\tUnchanged\t\t\t
78\tBasic Shipping : Basic Knowledge Business Process Shipping (Liner)\tUnchanged\t\t\t
79\tBPM - Assessment for Digital Transformation\tUnchanged\t\t\t
80\tBPM - Basic Shipping Induction Inbound and Outbound Process\tUnchanged\t\t\t
81\tBPM - Business Process Management Framework\tUnchanged\t\t\t
82\tBPM - Core Model Framework\tUnchanged\t\t\t
83\tBPM - Management of P3W\tUnchanged\t\t\t
84\tBPM - Project Management\tUnchanged\t\t\t
85\tBPM - Work Load Analysis for Project\tUnchanged\t\t\t
86\tBusiness Control Framework 2024\tUnchanged\t\t\t
87\tBusiness Negotiation Skill (Malik)\tUnchanged\t\t\t
88\tBusiness Presentation Skill (Malik)\tUnchanged\t\t\t
89\tBusiness Process Modelling for Level 10&Above\tUnchanged\t\t\t
90\tCLC - Backlog Management\tUnchanged\t\t\t
91\tCLC - Block Diagram pada System Electric\tUnchanged\t\t\t
92\tCLC - Block Diagram pada System Engine\tUnchanged\t\t\t
93\tCLC - Block Diagram pada System Hydraulic\tUnchanged\t\t\t
94\tCLC - Brake System\tUnchanged\t\t\t
95\tCLC - Cara Menggunakan Common Tool\tUnchanged\t\t\t
96\tCLC - Daily Maintenance\tUnchanged\t\t\t
97\tCLC - Differential & Final Drive\tUnchanged\t\t\t
98\tCLC - Electrical System\tUnchanged\t\t\t
99\tCLC - Engine System\tUnchanged\t\t\t
100\tCLC - Failure Analisis Report\tUnchanged\t\t\t
101\tCLC - Hydraulic System\tUnchanged\t\t\t
102\tCLC - Hydraulic Troubleshooting\tUnchanged\t\t\t
103\tCLC - Karakteristik Komponen Elektrik\tUnchanged\t\t\t
104\tCLC - Karakteristik Komponen Non Elektrik\tUnchanged\t\t\t
105\tCLC - Maintenance Process\tUnchanged\t\t\t
106\tCLC - Mekanik Troubleshooting\tUnchanged\t\t\t
107\tCLC - Nama, Fungsi, & Prinsip Kerja Komponen Engine\tUnchanged\t\t\t
108\tCLC - Pembacaan Menu pada Monitoring System\tUnchanged\t\t\t
109\tCLC - Penanganan Claim Container\tUnchanged\t\t\t
110\tCLC - Pengenalan Fungsi dari Komponen Accesories\tUnchanged\t\t\t
111\tCLC - Pengenalan Fungsi dari Komponen Electric\tUnchanged\t\t\t
112\tCLC - Pengenalan Fungsi dari Komponen Hydraulic\tUnchanged\t\t\t
113\tCLC - Pengenalan Fungsi dari Komponen Power Train\tUnchanged\t\t\t
114\tCLC - Pengetahuan Forklift\tUnchanged\t\t\t
115\tCLC - Pengetahuan Reach Stacker\tUnchanged\t\t\t
116\tCLC - Perencanaan Kebutuhan Alat Mekanis\tUnchanged\t\t\t
117\tCLC - Perencanaan Lay Out Depo\tUnchanged\t\t\t
118\tCLC - Pricing Strategy\tUnchanged\t\t\t
119\tCLC - Setting and Adjustment (Major Component)\tUnchanged\t\t\t
120\tCLC - Stack Hampar Container\tUnchanged\t\t\t
121\tCLC - Stuffing Stripping\tUnchanged\t\t\t
122\tCLC - Teknik Dasar Pengelasan\tUnchanged\t\t\t
123\tCLC - Teknik Lepas & Pasang Komponen Electric\tUnchanged\t\t\t
124\tCLC - Teknik Survey & Quality Control\tUnchanged\t\t\t
125\tCLC - Tyre Management\tUnchanged\t\t\t
126\tCLC - Upload & Download Program pada Unit\tUnchanged\t\t\t
127\tCLC - Yard Management system\tUnchanged\t\t\t
128\tCLC- Penanganan Cargo\tUnchanged\t\t\t
129\tCode of Conduct\tUnchanged\t\t\t
130\tCode of Conduct (English Version)\tUnchanged\t\t\t
131\tCode of Conduct for Manager\tUnchanged\t\t\t
132\tCompany Profile 2024\tUnchanged\t\t\t
133\tCompany Regulation 2025-2027 (English Version)\tUnchanged\t\t\t
134\tCompany Regulation 2025-2027 (Indonesian Version)\tUnchanged\t\t\t
135\tContract Management System for Level 10&Above\tUnchanged\t\t\t
136\tControl and Monitoring (Malik)\tUnchanged\t\t\t
137\tCorp Comm - Branding Development\tUnchanged\t\t\t
138\tCorp Comm - Communication Campaign\tUnchanged\t\t\t
139\tCorporate Culture 2025\tUnchanged\t\t\t
140\tCrewing - Awareness ISO 37001:2016\tUnchanged\t\t\t
141\tCrewing - Pelatihan Audit Internal ISO 37001:2016\tUnchanged\t\t\t
142\tEdukasi Pemilahan Sampah\tUnchanged\t\t\t
143\tEffective Collaboration (Malik)\tUnchanged\t\t\t
144\tEffective Planning (Malik)\tUnchanged\t\t\t
145\tFin & Acc - Bills to Invoice\tUnchanged\t\t\t
146\tFin & Acc - Vendor Invoice Acceptance\tUnchanged\t\t\t
147\tFraud Awareness\tUnchanged\t\t\t
148\tGA - Vehicle Maintenance\tUnchanged\t\t\t
149\tGA - Vehicle Selling\tUnchanged\t\t\t
150\tGA - Vehicle Usage\tUnchanged\t\t\t
151\tGood Corporate Governance 2024\tUnchanged\t\t\t
152\tGroup Policy - Authority Matrix\tUnchanged\t\t\t
153\tGroup Policy - CAPEX\tUnchanged\t\t\t
154\tGroup Policy for Level 10&Above\tUnchanged\t\t\t
155\tHealth Talk - Pencernaan Kuat, Hidup Nikmat\tUnchanged\t\t\t
156\tHealth Talk: Hari Anak - Ready, Set, School 2024\tUnchanged\t\t\t
157\tHealth Talk: Virus Monkeypox\tUnchanged\t\t\t
158\tHMM - Claim Procedure\tUnchanged\t\t\t
159\tHMM - Stowage & Cargo Overview\tUnchanged\t\t\t
160\tHow To Create Contract - TPS (HMM)\tUnchanged\t\t\t
161\tHR - Aspek Normatif Hubungan Industrial\tUnchanged\t\t\t
162\tHR - Manajemen Remunerasi\tUnchanged\t\t\t
163\tHR - Manajemen Talenta\tUnchanged\t\t\t
164\tHR - Melaksanakan Analisa Beban Kerja\tUnchanged\t\t\t
165\tHR - Membangun Komunikasi Organisasi Yang Efektif\tUnchanged\t\t\t
166\tHR - Menyusun dan Merancang Kebutuhan Pembelajaran\tUnchanged\t\t\t
167\tHR - Menyusun Kebutuhan SDM\tUnchanged\t\t\t
168\tHR - Menyusun Peraturan Perusahaan & Perjanjian Kerja\tUnchanged\t\t\t
169\tHR - Menyusun Uraian Jabatan\tUnchanged\t\t\t
170\tHR - Merancang Struktur Organisasi\tUnchanged\t\t\t
171\tHR - Merumuskan Indikator Kinerja Individu\tUnchanged\t\t\t
172\tHR - Merumuskan Proses Bisnis dan SOP MSDM\tUnchanged\t\t\t
173\tHR - Merumuskan Strategi Manajemen SDM\tUnchanged\t\t\t
174\tHR - Perselisihan Hubungan Industrial\tUnchanged\t\t\t
175\tHR - Strategic Interviewing\tUnchanged\t\t\t
176\tInternal Audit - Enterprise Risk Management\tUnchanged\t\t\t
177\tIntroduction to E-Pact (Employee Self Service)\tUnchanged\t\t\t
178\tIntroduction to HRIS & Time Management Module PeopleStrong\tUnchanged\t\t\t
179\tIntroduction to Manager as A Profession\tUnchanged\t\t\t
180\tIntroduction to Objectives & Key Results 2024\tUnchanged\t\t\t
181\tIntroduction to PeopleStrong – Learning Module\tUnchanged\t\t\t
182\tIR Management for Level 10&Above - 2025\tUnchanged\t\t\t
183\tIT - Agile: Scrum Introduction\tUnchanged\t\t\t
184\tIT - BitLocker Implementation Security Awareness\tUnchanged\t\t\t
185\tIT - Cybersecurity Awareness 2023\tUnchanged\t\t\t
186\tIT - Design System\tUnchanged\t\t\t
187\tIT - Electronic Data Interchange Introduction\tUnchanged\t\t\t
188\tIT - Implementation of Cast Software as Software Intelligence\tUnchanged\t\t\t
189\tIT - Implementing RPA to Support The Business\tUnchanged\t\t\t
190\tIT - Infrastructure and Application Modernization\tUnchanged\t\t\t
191\tIT - Introduction to Microsoft Fabric\tUnchanged\t\t\t
192\tIT - Meratus ACE Support Services\tUnchanged\t\t\t
193\tIT - Network Operation Center Introduction\tUnchanged\t\t\t
194\tIT - Personal Data Protection Law: Things You Need to Know\tUnchanged\t\t\t
195\tIT - Remote Monitoring System for Vessel IoT Solution\tUnchanged\t\t\t
196\tIT - Secure Access Service Edge (SASE)\tUnchanged\t\t\t
197\tIT - Test Driven Development Introduction\tUnchanged\t\t\t
198\tIT - Understanding Security in Development and Operations\tUnchanged\t\t\t
199\tIT - UX Research\tUnchanged\t\t\t
200\tIT- Clean Architecture Design Pattern\tUnchanged\t\t\t
201\tLeaders Talk: Artificial Intelligence\tUnchanged\t\t\t
202\tLeaders Talk: Create Value Through Integrity - 2024\tUnchanged\t\t\t
203\tLeaders Talk: Economic Outlook\tUnchanged\t\t\t
204\tLeaders Talk: Hari Anti Korupsi Sedunia\tUnchanged\t\t\t
205\tLeaders Talk: Intrapreneurship (Result Oriented)\tUnchanged\t\t\t
206\tLeaders Talk: Intrapreneurship (Sense of Ownership)\tUnchanged\t\t\t
207\tLeaders Talk: Kenali Demam Berdarah dan Pencegahannya\tUnchanged\t\t\t
208\tLeaders Talk: Lesson from Eiger - From Local to the World\tUnchanged\t\t\t
209\tLeaders Talk: Nutrition Day 2024\tUnchanged\t\t\t
210\tLeaders Talk: We Aim for Customer Excellence (Collaboration)\tUnchanged\t\t\t
211\tLeaders Talk: We Put People First (Be A Buddy)\tUnchanged\t\t\t
212\tLegal - Amendment to Indonesian Shipping Law 101\tUnchanged\t\t\t
213\tLegal - Implementation of Shipping Law\tUnchanged\t\t\t
214\tLegal - Indonesia Capital Market\tUnchanged\t\t\t
215\tLegal - Overview of Indonesia Employment Law\tUnchanged\t\t\t
216\tLegal - Personal Data Protection\tUnchanged\t\t\t
217\tLegal - Teknik Merancang Kontrak\tUnchanged\t\t\t
218\tLiner - Basic Operation : Transshipment\tUnchanged\t\t\t
219\tLiner Commercial - Basic Shipping : 07. Term of Shipment\tUnchanged\t\t\t
220\tLiner Commercial - Basic Shipping : 11. Basic Container\tUnchanged\t\t\t
221\tLiner Commercial - Basic Shipping : 13. Reefer Handling\tUnchanged\t\t\t
222\tLiner Commercial - Basic Shipping : 14. Breakbulk Cargo & Project\tUnchanged\t\t\t
223\tLiner Commercial - Basic Shipping : 15. Cost of Failure Branch\tUnchanged\t\t\t
224\tLiner Commercial - Basic Shipping : 16. Sales Activity & Customer Profile\tUnchanged\t\t\t
225\tLiner Commercial - Basic Shipping : 2. Product Knowledge and Cargo Shipment\tUnchanged\t\t\t
226\tLiner Commercial - Basic Shipping : 4.Basic Cargo Knowledge\tUnchanged\t\t\t
227\tLiner Commercial - Basic Shipping : 6. Bill of Lading\tUnchanged\t\t\t
228\tLiner Commercial - Basic Shipping : Booking Process\tUnchanged\t\t\t
229\tLiner Commercial - Basic Shipping: 1.Service Excellence\tUnchanged\t\t\t
230\tLiner Commercial - Basic Shipping: 10. Liner Services\tUnchanged\t\t\t
231\tLiner Commercial - Basic Shipping: 12. Dangerous Goods\tUnchanged\t\t\t
232\tLiner Commercial - Basic Shipping: 3. FAQ for Customer\tUnchanged\t\t\t
233\tLiner Commercial - Basic Shipping: 8. Terminal Productivity & Operation Pattern\tUnchanged\t\t\t
234\tLiner Commercial - Basic Shipping: Incoterm 2020\tUnchanged\t\t\t
235\tLiner Commercial - Basic Shipping: Marine Insurance\tUnchanged\t\t\t
236\tLiner Commercial - Basic Shipping: Meratus Extra (VAS)\tUnchanged\t\t\t
237\tLiner Commercial - Basic Shipping: Pengetahuan Kepabeanan dan Exim untuk Pelayaran\tUnchanged\t\t\t
238\tLiner Commercial - Body Language\tUnchanged\t\t\t
239\tLiner Commercial - Business Development\tUnchanged\t\t\t
240\tLiner Commercial - Calculate Rate & Freight\tUnchanged\t\t\t
241\tLiner Commercial - Customer Contract & Key Account Management\tUnchanged\t\t\t
242\tLiner Commercial - Decision Making Unit\tUnchanged\t\t\t
243\tLiner Commercial - Halal Cargo Assurance\tUnchanged\t\t\t
244\tLiner Commercial - Know Your Customer\tUnchanged\t\t\t
245\tLiner Commercial - Marine Cargo Insurance\tUnchanged\t\t\t
246\tLiner Commercial - SOC Business\tUnchanged\t\t\t
247\tLiner Commercial: Handling Complaint\tUnchanged\t\t\t
248\tLiner Ops - MFEC: Operational Ship Performance\tUnchanged\t\t\t
249\tLiner Ops - Ship Stability\tUnchanged\t\t\t
250\tLiner Ops - Voyage Proforma & Scheduling Introduction\tUnchanged\t\t\t
251\tLiner Trade - 01. Route Profitability\tUnchanged\t\t\t
252\tLiner Trade - Annual Budgeting\tUnchanged\t\t\t
253\tLiner Trade - Contribution Margin Engine, Time Charter Equivalent, and VOE\tUnchanged\t\t\t
254\tLiner Trade - Customer Segmentation\tUnchanged\t\t\t
255\tLiner Trade - Joint Slot 2024\tUnchanged\t\t\t
256\tLiner Trade - Slot Cost\tUnchanged\t\t\t
257\tLiner Trade - Tier Pricing\tUnchanged\t\t\t
258\tLogistics - Cargo & Document Handling\tUnchanged\t\t\t
259\tLogistics - Claim and Insurance\tUnchanged\t\t\t
260\tLogistics - ISO License Audit Process\tUnchanged\t\t\t
261\tLogistics - Penerapan SJPH dan Penyelia Halal\tUnchanged\t\t\t
262\tLogistics - Vendor Management: Sea Freight Domestic\tUnchanged\t\t\t
263\tManagement by Objective (Malik)\tUnchanged\t\t\t
264\tManaging Conflicts (Malik)\tUnchanged\t\t\t
265\tManaging Conversation (Malik)\tUnchanged\t\t\t
266\tManaging Meeting (Malik)\tUnchanged\t\t\t
267\tManaging Superiors and Colleagues (Malik)\tUnchanged\t\t\t
268\tManaging Yourself (Malik)\tUnchanged\t\t\t
269\tMELISA - Booking Module\tUnchanged\t\t\t
270\tMELISA - Customer Master\tUnchanged\t\t\t
271\tMELISA - Customer Tier Pricing DSS\tUnchanged\t\t\t
272\tMELISA - Documentation Module\tUnchanged\t\t\t
273\tMELISA - Invoice Data Reference\tUnchanged\t\t\t
274\tMELISA - Invoicing Module v0\tUnchanged\t\t\t
275\tMELISA - Node Master 2024\tUnchanged\t\t\t
276\tMELISA - On/Off Hire Module 2024\tUnchanged\t\t\t
277\tMELISA - Penalty Booking\tUnchanged\t\t\t
278\tMELISA - Port Call Report 2024\tUnchanged\t\t\t
279\tMelisa - Quick Manual Container Movement and Status\tUnchanged\t\t\t
280\tMELISA - Rate Report\tUnchanged\t\t\t
281\tMELISA - Rating Method\tUnchanged\t\t\t
282\tMELISA - Service Contract\tUnchanged\t\t\t
283\tMELISA - Surcharge 2025\tUnchanged\t\t\t
284\tMelisa - Training for SPU\tUnchanged\t\t\t
285\tMELISA - VAS Booking\tUnchanged\t\t\t
286\tMeratus's New Vision and Mission\tUnchanged\t\t\t
287\tM-One : Customer Journey\tUnchanged\t\t\t
288\tM-One : Induction M-One for Internal Stakeholders\tUnchanged\t\t\t
289\tMQS: P3W Awareness\tUnchanged\t\t\t
290\tMSA - Management System & Data Base PBM\tUnchanged\t\t\t
291\tMSA - Pelatihan Dasar Pengoperasian Ruber TYRE GANTRY\tUnchanged\t\t\t
292\tMSA - Pelatihan Dasar Pengoperasian Side Loader Single Handler\tUnchanged\t\t\t
293\tMSA - Pelatihan Harbour Mobile Crane\tUnchanged\t\t\t
294\tMSA - Penanganan Container\tUnchanged\t\t\t
295\tMSA - Penanganan Reefer Container\tUnchanged\t\t\t
296\tMSA - Penanganan Uncontainerized\tUnchanged\t\t\t
297\tMSA - Penanggulangan Kebakaran dan Pengenalan APAR\tUnchanged\t\t\t
298\tMSA - Pendapatan & Biaya PBM\tUnchanged\t\t\t
299\tMSA - Pengetahuan Bongkar Muat 2023\tUnchanged\t\t\t
300\tMSA - Pengetahuan Claim PBM\tUnchanged\t\t\t
301\tMSA - Pengetahuan Container\tUnchanged\t\t\t
302\tMSA - Pengetahuan Stowage Plan\tUnchanged\t\t\t
303\tMSA - Pengoperasian Dasar Ship to Shore\tUnchanged\t\t\t
304\tMSA - Perencanaan Bongkar Muat\tUnchanged\t\t\t
305\tMSA - Perencanaan Kebutuhan TKBM\tUnchanged\t\t\t
306\tMSA - Perencanaan Layout CY\tUnchanged\t\t\t
307\tMSA - Stacking Container di CY\tUnchanged\t\t\t
308\tMSM - Painting & Maintenance\tUnchanged\t\t\t
309\tMSM Machinery - 01 Aux Mach Fuel System - 2025\tUnchanged\t\t\t
310\tMSM Machinery - 01 Engine Performance_Normal Operation\tUnchanged\t\t\t
311\tMSM Machinery - 01 Engine Plan_Fuel System\tUnchanged\t\t\t
312\tMSM Machinery - 02 Aux Mach Charge Air System\tUnchanged\t\t\t
313\tMSM Machinery - 02 Engine Performance_Overload Engine Operation\tUnchanged\t\t\t
314\tMSM Machinery - 02 Engine Plan_Charge Scavenge Air System\tUnchanged\t\t\t
315\tMSM Machinery - 03 Engine Performance - Function of Collecting Data\tUnchanged\t\t\t
316\tMSM Machinery - 03 Engine Plan_Compression System\tUnchanged\t\t\t
317\tMSM Machinery - 04 Aux Mach_Refrigerator\tUnchanged\t\t\t
318\tMSM Machinery - 04 Engine Performance - Heat Balance & Efficiency\tUnchanged\t\t\t
319\tMSM Machinery - 04 Engine Plan_Starting Air System\tUnchanged\t\t\t
320\tMSM Machinery - 05 Aux Mach_Controllable Pitch Propeller\tUnchanged\t\t\t
321\tMSM Machinery - 05 Engine Performance_Monitoring of Engine Performance\tUnchanged\t\t\t
322\tMSM Machinery - 05 Engine Plan_Cooling System\tUnchanged\t\t\t
323\tMSM Machinery - 06 Aux Mach_Lubricating Oil System\tUnchanged\t\t\t
324\tMSM Machinery - 06 Engine Plan_Lubricating System\tUnchanged\t\t\t
325\tMSM Machinery - 07 Aux Mach_Cooling System\tUnchanged\t\t\t
326\tMSM Machinery - 08 Aux Mach_Starting System\tUnchanged\t\t\t
327\tMSM Machinery - 09 Aux Mach_Purification System\tUnchanged\t\t\t
328\tMSM Marine - 01 Safety Of Life At Sea\tUnchanged\t\t\t
329\tMSM Marine - 02 Marine Polution\tUnchanged\t\t\t
330\tMSM Marine - 03 STCW 2010\tUnchanged\t\t\t
331\tMSM Marine - 04 MLC 2006\tUnchanged\t\t\t
332\tMSM Marine - 05 ISM Code\tUnchanged\t\t\t
333\tMSM Marine - 06 ISPS Code\tUnchanged\t\t\t
334\tMSM Marine - 07 Ballast Water Management\tUnchanged\t\t\t
335\tMSM Marine - 08 Garbage Management\tUnchanged\t\t\t
336\tMSM Marine - 09 Bridge Resource Management\tUnchanged\t\t\t
337\tMSM Marine - 10 Safety Drill\tUnchanged\t\t\t
338\tMSM Marine - 12 Class Survey & 13 Ship Certificates\tUnchanged\t\t\t
339\tMSM Marine - 14 Crewing Management & Certificate\tUnchanged\t\t\t
340\tMSM Marine - 15 UU Pelayaran\tUnchanged\t\t\t
341\tNOVA - User Manual & Procedure\tUnchanged\t\t\t
342\tOKR Certification: Leadership and Goal Setting (Module 1)\tUnchanged\t\t\t
343\tOKR Certification: Leadership and Goal Setting (Module 2)\tUnchanged\t\t\t
344\tOKR Certification: Leadership and Goal Setting (Module 3)\tUnchanged\t\t\t
345\tOKR Certification: Leadership and Goal Setting (Module 4)\tUnchanged\t\t\t
346\tPersonal Development - 15 Management Essential to Become Good Manager - 2024\tUnchanged\t\t\t
347\tPersonal Development: Computer Posture\tUnchanged\t\t\t
348\tPersonal Development: Etika Pergaulan\tUnchanged\t\t\t
349\tProblem Solving (Malik)\tUnchanged\t\t\t
350\tProcurement - Basic Knowledge\tUnchanged\t\t\t
351\tProcurement - D365 : Inventory Request dan Purchase Request\tUnchanged\t\t\t
352\tProcurement - D365 : Request for Quotation & Purchase Order\tUnchanged\t\t\t
353\tProcurement - Distribution Management\tUnchanged\t\t\t
354\tProcurement - Finance for Non Finance\tUnchanged\t\t\t
355\tProcurement - Inventory Management\tUnchanged\t\t\t
356\tProcurement - Warehouse Management\tUnchanged\t\t\t
357\tProcurement MSM - Econnect Flow & Functionalities\tUnchanged\t\t\t
358\tQuality Awareness\tUnchanged\t\t\t
359\tRisk Management for Level 12&Above\tUnchanged\t\t\t
360\tRoot Cause Analysis for Level 10&Above\tUnchanged\t\t\t
361\tSafety Leadership 2024\tUnchanged\t\t\t
362\tSistem Informasi Ketidaksesuaian dan Pengembangan (SIKaP)\tUnchanged\t\t\t
363\tSM - Docking Contract\tUnchanged\t\t\t
364\tSM - Docking D-12\tUnchanged\t\t\t
365\tSM - MariApps COMPASS Change Management\tUnchanged\t\t\t
366\tSM Docking Management - Module 1: Background and Introduction to Dry Docking\tUnchanged\t\t\t
367\tSM Docking Management - Module 2: Project Management\tUnchanged\t\t\t
368\tSM Docking Management - Module 3: Planning and Specification\tUnchanged\t\t\t
369\tSM Docking Management - Module 4: Tendering for Dry Dock Work\tUnchanged\t\t\t
370\tSM Docking Management - Module 5: Dry Dock Preparation, Execution, and Supervision\tUnchanged\t\t\t
371\tSM Docking Management - Module 6: Docking, Undocking and Completion of Project\tUnchanged\t\t\t
372\tSM Workshop - Generator\tUnchanged\t\t\t
373\tSM Workshop - Global Maritime Distress Safety System\tUnchanged\t\t\t
374\tSosialisasi Aktivasi & Registrasi CORETAX\tUnchanged\t\t\t
375\tSosialisasi BPJS Kesehatan Segmen PPU\tUnchanged\t\t\t
376\tSosialisasi BPJS Ketenagakerjaan - Manfaat Layanan BPJS\tUnchanged\t\t\t
377\tStakeholder Management\tUnchanged\t\t\t
378\tThe Will to Perform (Malik)\tUnchanged\t\t\t
379\tTrucking - Abnormality Monitoring\tUnchanged\t\t\t
380\tTrucking - Account Payable and DC Admin\tUnchanged\t\t\t
381\tTrucking - Account Receivable and DC Admin\tUnchanged\t\t\t
382\tTrucking - Backlog Management\tUnchanged\t\t\t
383\tTrucking - Basic Investigation & Root Cause Analysis\tUnchanged\t\t\t
384\tTrucking - Basic Monitoring by GPS\tUnchanged\t\t\t
385\tTrucking - Basic Transport Analyst\tUnchanged\t\t\t
386\tTrucking - Basic Trucking Knowledge\tUnchanged\t\t\t
387\tTrucking - Business Offering (RFQ), Payment (Trip Cost, Fuel)\tUnchanged\t\t\t
388\tTrucking - Business Overview\tUnchanged\t\t\t
389\tTrucking - Control Tower\tUnchanged\t\t\t
390\tTrucking - Control Tower Reporting\tUnchanged\t\t\t
391\tTrucking - Daily Inspection (P2H)\tUnchanged\t\t\t
392\tTrucking - Database Driver & Personnel Management\tUnchanged\t\t\t
393\tTrucking - Document Control\tUnchanged\t\t\t
394\tTrucking - Dokumen & Legalitas\tUnchanged\t\t\t
395\tTrucking - Driver Management\tUnchanged\t\t\t
396\tTrucking - Driver Performance & Evaluation\tUnchanged\t\t\t
397\tTrucking - Driver Regulation & Compliance\tUnchanged\t\t\t
398\tTrucking - Inventory Management\tUnchanged\t\t\t
399\tTrucking - Maintenance Planning & Scheduling\tUnchanged\t\t\t
400\tTrucking - MJT Operation Overview\tUnchanged\t\t\t
401\tTrucking - QSHE Operational Trucking\tUnchanged\t\t\t
402\tTrucking - Recruitment & Screening Driver\tUnchanged\t\t\t
403\tTrucking - Risk Assesment & HIRADC\tUnchanged\t\t\t
404\tTrucking - Road Hazard Mapping\tUnchanged\t\t\t
405\tTrucking - Safety Analysis & Proactive Risk Identification\tUnchanged\t\t\t
406\tTrucking - Safety Observation Card\tUnchanged\t\t\t
407\tTrucking - Warehouse Management\tUnchanged\t\t\t
408\tTutorial Pelaporan SPT Tahunan Karyawan dan Pemadanan NIK-NPWP\tUnchanged\t\t\t
409\tVendor Management: VMT and Sales Guidance\tUnchanged\t\t\t`;

// HRBP MAPPING LOGIC
const getHRBP = (sbu: string) => {
  const s = (sbu || '').toLowerCase();
  if (s.includes('asset') || s.includes('charter')) return 'Akbar';
  if (s.includes('bpm') || s.includes('it')) return 'Berhard';
  if (s.includes('corp') || s.includes('fin') || s.includes('acc') || s.includes('ga') || s.includes('hmm') || s.includes('hr') || s.includes('audit') || s.includes('legal') || s.includes('procurement')) return 'Sherly';
  if (s.includes('crewing') || s.includes('msm')) return 'Sentra';
  if (s.includes('commercial') || s.includes('operation') || s.includes('trade') || s.includes('academy')) return 'Andrew';
  if (s.includes('logistic') || s.includes('trucking')) return 'Taufik';
  if (s.includes('mtm') || s.includes('terminal')) return 'Ronny';
  return 'Unassigned';
};

// Reusable Components
const MultiSelectDropdown = ({ label, options, selectedValues, onToggle }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef} style={{ zIndex: isOpen ? 100 : 50 }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white border border-slate-300 text-slate-600 text-[10px] font-bold uppercase rounded-lg px-3 py-2 flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm active:bg-slate-100 h-[34px]"
      >
        <span className="opacity-60">{label}:</span> 
        <span className="text-slate-800">
          {selectedValues.length === 0 || selectedValues.includes('all') ? 'All' : `${selectedValues.length} Active`}
        </span>
        <ChevronDown size={12} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-2 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-1 mb-1 border-b border-slate-100">
             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Select Filters</span>
          </div>
          {options.map((opt: any) => (
            <label key={opt.id} className="flex items-center px-4 py-2.5 hover:bg-slate-50 cursor-pointer group transition-colors">
              <div className={`w-4 h-4 border rounded flex items-center justify-center transition-all ${selectedValues.includes(opt.id) ? 'bg-blue-600 border-blue-600 shadow-sm' : 'border-slate-300 group-hover:border-blue-500'}`}>
                {selectedValues.includes(opt.id) && <Check size={10} className="text-white stroke-[4px]" />}
              </div>
              <input 
                type="checkbox" 
                className="hidden" 
                checked={selectedValues.includes(opt.id)}
                onChange={() => onToggle(opt.id)}
              />
              <span className={`ml-3 text-[10px] font-bold uppercase tracking-wider ${selectedValues.includes(opt.id) ? 'text-blue-600' : 'text-slate-600'}`}>
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

function useFilterDropdown(initialValue = "") {
  const [value, setValue] = useState(initialValue);
  return { value, setValue };
}

const GlobalSuggestionInput = ({ value, setValue, placeholder, list, icon: Icon }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full sm:w-48 lg:w-56 flex-shrink-0" ref={ref}>
      <div className="relative flex items-center group">
        <Icon className="absolute left-3.5 h-3.5 w-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
        <input 
          type="text" 
          placeholder={placeholder} 
          className="w-full pl-9 pr-8 py-1.5 h-[32px] bg-white border border-slate-300 shadow-sm rounded-lg text-[10px] font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
          value={value}
          onChange={(e: any) => { setValue(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          onClick={() => setIsOpen(true)}
        />
        {value && (
          <button type="button" onClick={() => setValue("")} className="absolute right-2 p-1 hover:bg-slate-100 rounded-full transition-colors z-10">
            <X size={12} className="text-slate-400" />
          </button>
        )}
      </div>
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-2">
          {list
            .filter((i: string) => i.toLowerCase().includes(value.toLowerCase()))
            .slice(0, 30)
            .map((item: string, i: number) => (
              <button 
                key={i} 
                type="button"
                className="w-full text-left px-4 py-2.5 text-[11px] hover:bg-slate-50 text-slate-700 font-bold transition-colors border-b last:border-0 border-slate-100 uppercase"
                onClick={(e: any) => { 
                  e.preventDefault(); 
                  setValue(item); 
                  setIsOpen(false); 
                }}
              >
                {item}
              </button>
            ))
          }
          {list.filter((i: string) => i.toLowerCase().includes(value.toLowerCase())).length === 0 && (
             <div className="px-4 py-3 text-xs text-slate-500 font-medium italic text-center">No match found</div>
          )}
        </div>
      )}
    </div>
  );
};

// Inline Editable Cell Component
const EditableCell = ({ value, onSave, className, isLink }: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleBlur = () => {
    setIsEditing(false);
    if (localValue !== value) {
      onSave(localValue);
    }
  };

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      e.target.blur();
    } else if (e.key === 'Escape') {
      setLocalValue(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <input
        autoFocus
        value={localValue}
        onChange={e => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`w-full bg-white border border-blue-500 rounded px-1.5 py-1 outline-none focus:ring-2 focus:ring-blue-500/20 text-[10px] text-slate-800 font-medium shadow-sm ${className}`}
      />
    );
  }

  return (
    <div 
      onClick={() => setIsEditing(true)} 
      className={`cursor-text hover:bg-blue-50 hover:border-blue-200 border border-transparent px-1.5 py-1 rounded transition-colors min-h-[24px] flex items-center break-all ${className}`}
      title="Click to edit"
    >
      {value ? (isLink ? <span className="truncate max-w-[150px] inline-block">{value}</span> : value) : <span className="text-slate-300 italic text-[9px]">Empty</span>}
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [moduleView, setModuleView] = useState('all'); 

  const [statusFilters, setStatusFilters] = useState<string[]>(['all']); 
  const [sortOrder, setSortOrder] = useState('default'); 
  
  const [rawData, setRawData] = useState(DEFAULT_TSV);
  
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [user, setUser] = useState<any>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  const { value: searchFilter, setValue: setSearchFilter } = useFilterDropdown("");
  const { value: sbuFilter, setValue: setSbuFilter } = useFilterDropdown("");
  const { value: hrbpFilter, setValue: setHrbpFilter } = useFilterDropdown("");

  // FIREBASE INIT
  useEffect(() => {
    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
      } catch (err: any) { 
        console.error("Firebase Auth Error:", err); 
        setSyncError("Auth Fail"); 
        setIsLoadingData(false);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (u: any) => {
      setUser(u);
      if (!u) setIsLoadingData(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const docRef = doc(db, 'dashboard', 'module_tracker_data_v2');
    const unsubscribe = onSnapshot(docRef, (docSnap: any) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (typeof data.tsvData === 'string') {
          setRawData(data.tsvData);
        }
      }
      setIsLoadingData(false);
      setSyncError(null);
    }, (err: any) => {
      console.error("Firestore Sync Error:", err); 
      setSyncError("Sync Fail");
      setIsLoadingData(false);
    });
    return () => unsubscribe();
  }, [user]);

  const parsedData = useMemo(() => {
    if (!rawData || rawData.trim() === '') return []; 
    const lines = rawData.trim().split(/\r?\n/);
    if (lines.length < 2) return [];
    
    const headers = lines[0].split('\t').map((h: string) => h.trim());
    
    const allRows = lines.slice(1).reduce((acc: any[], line: string, idx: number) => {
      if (!line || line.trim() === '') return acc;

      const values = line.split('\t');
      const obj: Record<string, any> = {};
      headers.forEach((header: string, i: number) => { obj[header] = values[i] ? values[i].trim() : ''; });
      
      const rawStatus = (obj['Status'] || '').toLowerCase();
      if (rawStatus.includes('baru') || rawStatus.includes('new')) return acc;

      if (rawStatus.includes('diperbarui') || rawStatus.includes('updated')) obj._normStatus = 'Updated';
      else obj._normStatus = 'On Progress';

      obj._linkNew = obj['Link Terbaru'] || null;
      obj._linkOld = obj['Link File Lama'] || null;
      obj._order = parseInt(obj['No'] || obj['NO']) || 0;
      obj._originalIndex = idx + 1; // Preserve original line index for inline editing
      
      // Auto Assign HRBP
      obj._hrbp = getHRBP(obj['Group SBU/SFU']);

      if (obj['Nama Module']) acc.push(obj);
      return acc;
    }, []); 

    const uniqueModulesMap = new Map();
    allRows.forEach((row: any) => {
      const titleKey = row['Nama Module'].trim().toLowerCase();
      if (uniqueModulesMap.has(titleKey)) {
        const existing = uniqueModulesMap.get(titleKey);
        if (row._normStatus === 'Updated' && existing._normStatus !== 'Updated') {
          uniqueModulesMap.set(titleKey, row);
        } else if (row._normStatus === existing._normStatus) {
          uniqueModulesMap.set(titleKey, row);
        }
      } else {
        uniqueModulesMap.set(titleKey, row);
      }
    });

    return Array.from(uniqueModulesMap.values());
  }, [rawData]);

  const suggestions = useMemo(() => ({
    names: [...new Set(parsedData.map((d: any) => d['Nama Module']).filter(Boolean))].sort(),
    sbus: [...new Set(parsedData.map((d: any) => d['Group SBU/SFU']).filter(Boolean))].sort(),
    hrbps: [...new Set(parsedData.map((d: any) => d._hrbp).filter(Boolean))].sort()
  }), [parsedData]);

  const globallyFilteredData = useMemo(() => {
    let data = parsedData;
    if (searchFilter) {
      const lowerSearch = searchFilter.toLowerCase();
      data = data.filter((d: any) => (d['Nama Module'] || '').toLowerCase().includes(lowerSearch));
    }
    if (sbuFilter) data = data.filter((d: any) => (d['Group SBU/SFU'] || '').toLowerCase().includes(sbuFilter.toLowerCase()));
    if (hrbpFilter) data = data.filter((d: any) => (d._hrbp || '').toLowerCase().includes(hrbpFilter.toLowerCase()));
    return data;
  }, [parsedData, searchFilter, sbuFilter, hrbpFilter]);

  const metrics = useMemo(() => {
    const data = globallyFilteredData;
    let updatedCount = 0, unchangedCount = 0;
    const sbuMap: Record<string, any> = {};

    data.forEach((d: any) => {
      const sbu = d['Group SBU/SFU'] || 'Unknown SBU';
      if (!sbuMap[sbu]) sbuMap[sbu] = { name: sbu, total: 0, updated: 0, hrbp: d._hrbp };
      sbuMap[sbu].total += 1;

      if (d._normStatus === 'Updated') {
        updatedCount++;
        sbuMap[sbu].updated += 1;
      } else if (d._normStatus === 'On Progress') {
        unchangedCount++;
      }
    });
    
    const sbuSummary = Object.values(sbuMap)
      .map((s: any) => ({
        ...s,
        activityScore: s.updated
      }))
      .sort((a: any, b: any) => b.activityScore - a.activityScore);

    const updateRate = data.length > 0 ? ((updatedCount / data.length) * 100).toFixed(1) : 0;

    return {
      total: data.length, updatedCount, unchangedCount, updateRate, sbuSummary
    };
  }, [globallyFilteredData]);

  const tableData = useMemo(() => {
    let baseData = globallyFilteredData;
    if (moduleView === 'updated') baseData = baseData.filter((d: any) => d._normStatus === 'Updated');
    if (moduleView === 'on_progress') baseData = baseData.filter((d: any) => d._normStatus === 'On Progress');

    if (!statusFilters.includes('all')) {
      baseData = baseData.filter((d: any) => {
        if (statusFilters.includes('updated') && d._normStatus === 'Updated') return true;
        if (statusFilters.includes('on_progress') && d._normStatus === 'On Progress') return true;
        return false;
      });
    }

    if (sortOrder === 'default') baseData = [...baseData].sort((a: any, b: any) => a._order - b._order);
    else if (sortOrder === 'az') baseData = [...baseData].sort((a: any, b: any) => (a['Nama Module'] || '').localeCompare(b['Nama Module'] || ''));
    else if (sortOrder === 'za') baseData = [...baseData].sort((a: any, b: any) => (b['Nama Module'] || '').localeCompare(a['Nama Module'] || ''));
    return baseData;
  }, [globallyFilteredData, moduleView, statusFilters, sortOrder]);

  const handleToggleFilter = (id: string, current: string[], setter: any) => {
    if (id === 'all') setter(['all']);
    else {
      let next = current.filter(item => item !== 'all');
      if (next.includes(id)) {
        next = next.filter(item => item !== id);
        if (next.length === 0) next = ['all'];
      } else next.push(id);
      setter(next);
    }
  };

  const handleSaveToCloud = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const docRef = doc(db, 'dashboard', 'module_tracker_data_v2');
      await setDoc(docRef, { tsvData: rawData, updatedAt: new Date().toISOString(), updatedBy: user.uid });
      // Keep user on the same tab they were on instead of throwing them to dashboard
    } catch (e: any) { 
      console.error("Save Document Error:", e);
      setSyncError("Save Failed"); 
    }
    finally { setIsSaving(false); }
  };

  const handleExportTable = () => {
    const b = new Blob([rawData], { type: 'text/tsv' }); 
    const u = URL.createObjectURL(b); 
    const a = document.createElement('a'); a.href = u; a.download = 'CCT_Module_Tracker_Raw.tsv'; a.click();
  };

  const handleExportExcel = () => {
    if (tableData.length === 0) return;
    
    const headers = ['No', 'Nama Module', 'Status', 'Group SBU/SFU', 'HRBP', 'Link Terbaru', 'Link File Lama', 'Notes'];
    
    const escapeCSV = (val: any) => {
      if (val === null || val === undefined) return '""';
      const str = String(val);
      return `"${str.replace(/"/g, '""')}"`;
    };

    const csvRows = [headers.join(',')];

    tableData.forEach((row: any) => {
      const rowData = [
        escapeCSV(row['No'] || row['NO']),
        escapeCSV(row['Nama Module']),
        escapeCSV(row._normStatus),
        escapeCSV(row['Group SBU/SFU']),
        escapeCSV(row._hrbp),
        escapeCSV(row._linkNew),
        escapeCSV(row._linkOld),
        escapeCSV(row['Notes'])
      ];
      csvRows.push(rowData.join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob(["\ufeff" + csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CCT_Modules_Export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAllFilters = () => { setSearchFilter(""); setSbuFilter(""); setHrbpFilter(""); };

  const handleCellEdit = async (originalIndex: number, headerFallback: string, newValue: string) => {
    const lines = rawData.split(/\r?\n/);
    if (!lines[0]) return;
    const headers = lines[0].split('\t').map((h: string) => h.trim());
    
    let headerIndex = headers.indexOf(headerFallback);
    if (headerIndex === -1 && headerFallback.toLowerCase() === 'no') {
        headerIndex = headers.findIndex(h => h.toLowerCase() === 'no');
    }
    
    if (headerIndex === -1) {
        headers.push(headerFallback);
        lines[0] = headers.join('\t');
        headerIndex = headers.length - 1;
    }

    const targetLine = lines[originalIndex];
    if (targetLine === undefined) return;
    
    const values = targetLine.split('\t');
    
    while(values.length <= headerIndex) values.push('');
    
    values[headerIndex] = newValue;
    lines[originalIndex] = values.join('\t');
    
    const newRawData = lines.join('\n');
    setRawData(newRawData);

    if (user) {
      setIsSaving(true);
      try {
        const docRef = doc(db, 'dashboard', 'module_tracker_data_v2');
        await setDoc(docRef, { tsvData: newRawData, updatedAt: new Date().toISOString(), updatedBy: user.uid });
      } catch (e: any) { 
        console.error("Auto-Save Document Error:", e);
        setSyncError("Auto-Save Failed"); 
      } finally {
        setIsSaving(false);
      }
    }
  };

  const StatusBadge = ({ status }: any) => {
    const styles = status === 'Updated' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-amber-100 text-amber-700 border-amber-200';
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest border shadow-sm ${styles}`}>
        {status === 'Updated' ? <FileEdit size={10} /> : <History size={10} />}
        {status.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-blue-200 selection:text-blue-900 flex flex-col overflow-hidden">
      
      {/* NAVBAR */}
      <nav className="h-[48px] bg-white text-slate-800 shadow-sm border-b border-slate-200 flex-shrink-0 z-50">
        <div className="h-full w-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-1 rounded-lg shadow-md">
              <ShieldCheck className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="font-black text-[12px] tracking-tight uppercase leading-tight text-slate-800">CCT Modules <span className="text-blue-600">Tracker</span></h1>
              <div className="flex items-center gap-1">
                <div className={`w-1.5 h-1.5 rounded-full ${syncError ? 'bg-rose-500' : 'bg-emerald-500 animate-pulse'}`}></div>
                <p className="text-[7px] text-slate-400 font-bold uppercase tracking-widest">{syncError || 'Cloud Sync Active'}</p>
              </div>
            </div>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            {[ 
              { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
              { id: 'modules', label: 'Detail View', icon: TableProperties },
              { id: 'source', label: 'Source Data', icon: Upload }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)} 
                className={`px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                <tab.icon size={11}/> {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* FILTER BAR */}
      {(activeTab === 'dashboard' || activeTab === 'modules') && (
        <div className="h-[44px] bg-white border-b border-slate-100 flex-shrink-0 z-40 shadow-sm">
           <div className="h-full w-full px-4 flex items-center gap-3 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-1.5 mr-1 shrink-0">
                 <Filter size={12} className="text-blue-500" />
                 <span className="text-[9px] font-black uppercase tracking-[0.1em] text-slate-500">Global Filters:</span>
              </div>
              <div className="flex gap-2 flex-1 sm:flex-none">
                <GlobalSuggestionInput value={hrbpFilter} setValue={setHrbpFilter} placeholder="Filter HRBP..." list={suggestions.hrbps} icon={Users} />
                <GlobalSuggestionInput value={sbuFilter} setValue={setSbuFilter} placeholder="Filter SBU/SFU..." list={suggestions.sbus} icon={Building2} />
                <GlobalSuggestionInput value={searchFilter} setValue={setSearchFilter} placeholder="Search Module Name..." list={suggestions.names} icon={Search} />
              </div>
              {(searchFilter || sbuFilter || hrbpFilter) && (
                <button onClick={clearAllFilters} className="text-[8px] font-black text-rose-500 bg-rose-50 px-3 py-1.5 rounded-full flex items-center gap-1 uppercase tracking-widest border border-rose-100 shadow-sm ml-auto transition-colors hover:bg-rose-100 shrink-0">
                  <X size={10} /> Clear
                </button>
              )}
           </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1 w-full overflow-hidden p-3 sm:p-4 bg-[#F8FAFC]">
        {isLoadingData ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400"><RefreshCw className="h-8 w-8 animate-spin mb-3 text-blue-500" /><p className="font-bold text-[10px] tracking-widest uppercase animate-pulse">Synchronizing Data...</p></div>
        ) : activeTab === 'dashboard' ? (
          
          <div className="h-full flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
            
            {/* Top Stat Cards - Compact View */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 shrink-0">
              {[
                { label: 'Total Modules', val: metrics.total, color: 'blue', icon: BookOpen },
                { label: 'Module Updated', val: metrics.updatedCount, color: 'indigo', icon: FileEdit },
                { label: 'On Progress', val: metrics.unchangedCount, color: 'amber', icon: History },
                { label: 'Update Rate', val: `${metrics.updateRate}%`, color: 'sky', icon: Activity }
              ].map((card, i) => (
                <div key={i} className={`bg-white p-3 rounded-2xl border-l-4 border-l-${card.color}-500 border-y border-r border-slate-200 shadow-sm flex flex-col justify-between h-[64px] relative overflow-hidden group hover:shadow-md transition-all`}>
                  <div className="flex justify-between items-start z-10">
                    <h3 className={`text-[9px] font-black text-${card.color}-600 uppercase tracking-widest`}>{card.label}</h3>
                    <card.icon size={12} className={`text-${card.color}-500 opacity-60`} />
                  </div>
                  <div className="text-xl font-black text-slate-800 tracking-tighter leading-none z-10 mt-1">{card.val}</div>
                  <div className={`absolute -right-2 -bottom-2 opacity-[0.03] group-hover:scale-110 transition-transform`}><card.icon size={45} /></div>
                </div>
              ))}
            </div>

            {/* SBU Tracking Grid (Full Width, No Scroll Optimised) */}
            <div className="flex-1 bg-white rounded-2xl border border-slate-200 flex flex-col min-h-0 shadow-sm overflow-hidden">
              <div className="px-4 py-2.5 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-2">
                  <Building2 className="text-blue-500" size={14} />
                  <h2 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">SBU / SFU Progress Tracking</h2>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> UPDATED</span>
                </div>
              </div>
              
              <div className="p-3 flex-1 overflow-y-auto custom-scrollbar bg-slate-50/50">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {metrics.sbuSummary.map((sbu: any, idx: number) => (
                    <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1.5 hover:border-blue-300 hover:shadow-md transition-all">
                      
                      {/* Header: SBU Name */}
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-black text-slate-800 truncate block uppercase leading-tight" title={sbu.name}>{sbu.name}</span>
                        </div>
                      </div>
                      
                      {/* Detail: Total Modules & HRBP */}
                      <div className="flex justify-between items-center mt-1">
                         <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{sbu.total} Total</span>
                         <span className="text-[8px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded uppercase tracking-widest flex items-center gap-1"><Users size={8} /> {sbu.hrbp}</span>
                      </div>
                      
                      {/* Progress Details */}
                      <div className="flex flex-col gap-1 mt-1">
                        <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-widest">
                          <span className="text-blue-600">Update: {sbu.updated}</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden flex shadow-inner">
                          <div className="bg-gradient-to-r from-blue-400 to-blue-500 h-full" style={{ width: `${(sbu.updated / sbu.total) * 100}%` }}></div>
                        </div>
                      </div>

                    </div>
                  ))}
                  {metrics.sbuSummary.length === 0 && (
                    <div className="col-span-full text-center py-8 text-xs text-slate-400 font-bold uppercase tracking-widest">No data matching current filters.</div>
                  )}
                </div>
              </div>
            </div>
          </div>

        ) : activeTab === 'modules' ? (
          
          <div className="h-full flex flex-col animate-in fade-in duration-300">
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="flex flex-col md:flex-row border-b border-slate-200 bg-slate-50/50 shrink-0">
                <div className="flex overflow-x-auto no-scrollbar flex-1 p-1">
                  {[
                    { id: 'all', label: 'Library', count: metrics.total, color: 'indigo' },
                    { id: 'updated', label: 'Updated', count: metrics.updatedCount, color: 'blue' },
                    { id: 'on_progress', label: 'On Progress', count: metrics.unchangedCount, color: 'amber' }
                  ].map(v => (
                    <button key={v.id} onClick={() => setModuleView(v.id)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${moduleView === v.id ? `bg-white text-${v.color}-600 shadow-sm border border-slate-200` : 'text-slate-400 hover:text-slate-800'}`}>
                      {v.label} <span className={`ml-1 px-1.5 py-0.5 rounded-full bg-${v.color}-50 text-${v.color}-600 text-[8px]`}>{v.count}</span>
                    </button>
                  ))}
                </div>
                <div className="flex items-center px-4 py-2 md:py-0 border-t md:border-t-0 border-slate-200 gap-2 shrink-0 bg-white md:bg-transparent">
                  <MultiSelectDropdown label="Status" options={[{id: 'all', label: 'All'},{id: 'updated', label: 'Updated'},{id: 'on_progress', label: 'On Progress'}]} selectedValues={statusFilters} onToggle={(id: string) => handleToggleFilter(id, statusFilters, setStatusFilters)} />
                  <select value={sortOrder} onChange={(e: any) => setSortOrder(e.target.value)} className="bg-white border border-slate-300 text-slate-700 text-[9px] font-black uppercase rounded-lg px-2 h-[32px] outline-none shadow-sm">
                    <option value="default">Default Sort</option>
                    <option value="az">A-Z Name</option>
                    <option value="za">Z-A Name</option>
                  </select>
                  <div className="flex items-center gap-1.5 border-l border-slate-200 pl-2 ml-1">
                    <button onClick={handleSaveToCloud} disabled={isSaving || !user} className="text-[9px] font-black text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-1.5 uppercase tracking-widest px-3 h-[32px] rounded-lg shadow-md transition-all active:scale-95 disabled:opacity-70" title="Sync Changes to Cloud">
                      {isSaving ? <RefreshCw size={11} className="animate-spin" /> : <Save size={11}/>} Sync
                    </button>
                    <button onClick={handleExportExcel} className="text-[9px] font-black text-white bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1.5 uppercase tracking-widest px-3 h-[32px] rounded-lg shadow-md transition-all active:scale-95" title="Export Filtered Data to Excel">
                      <FileSpreadsheet size={12}/> Excel
                    </button>
                    <button onClick={handleExportTable} className="text-[9px] font-black text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 flex items-center gap-1.5 uppercase tracking-widest px-3 h-[32px] rounded-lg shadow-sm transition-all active:scale-95" title="Export Raw Data">
                      <Download size={11}/> TSV
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-auto custom-scrollbar relative bg-white">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead className="sticky top-0 z-20 bg-slate-50 shadow-sm border-b border-slate-200">
                    <tr className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                      <th className="px-5 py-3 w-12 text-center">NO</th>
                      <th className="px-5 py-3 min-w-[250px]">Nama Module</th>
                      <th className="px-4 py-3 text-center">Status</th>
                      <th className="px-4 py-3">Group SBU</th>
                      <th className="px-4 py-3 text-center">HRBP</th>
                      <th className="px-5 py-3 text-center">Akses</th>
                      <th className="px-5 py-3 min-w-[150px]">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tableData.map((row: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-5 py-2.5">
                          <EditableCell 
                            value={row['No'] || row['NO']} 
                            onSave={(val: string) => handleCellEdit(row._originalIndex, row['NO'] !== undefined ? 'NO' : 'No', val)}
                            className="text-center font-bold text-slate-400 justify-center"
                          />
                        </td>
                        <td className="px-5 py-2.5">
                          <EditableCell 
                            value={row['Nama Module']} 
                            onSave={(val: string) => handleCellEdit(row._originalIndex, 'Nama Module', val)}
                            className="font-black text-slate-800 uppercase"
                          />
                        </td>
                        <td className="px-4 py-2.5 flex flex-col items-center justify-center">
                          <button 
                            onClick={() => {
                              const newStatus = row._normStatus === 'Updated' ? 'On Progress' : 'Updated';
                              handleCellEdit(row._originalIndex, 'Status', newStatus);
                            }}
                            className={`px-3 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest transition-all w-full flex items-center justify-center gap-1 border shadow-sm ${row._normStatus === 'Updated' ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:shadow-md' : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 hover:shadow-md'}`}
                            title="Click to toggle status"
                          >
                            {row._normStatus === 'Updated' ? <><FileEdit size={12}/> UPDATED</> : <><History size={12}/> PROGRESS</>}
                          </button>
                        </td>
                        <td className="px-4 py-2.5">
                          <EditableCell 
                            value={row['Group SBU/SFU']} 
                            onSave={(val: string) => handleCellEdit(row._originalIndex, 'Group SBU/SFU', val)}
                            className="font-bold text-slate-500 uppercase"
                          />
                        </td>
                        <td className="px-4 py-2.5 text-[10px] font-black text-blue-600 uppercase text-center align-middle">
                          {row._hrbp || '-'}
                        </td>
                        <td className="px-5 py-2.5">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[8px] font-bold text-slate-400 w-8">NEW:</span>
                              <div className="flex-1 min-w-0">
                                <EditableCell 
                                  value={row['Link Terbaru']} 
                                  onSave={(val: string) => handleCellEdit(row._originalIndex, 'Link Terbaru', val)}
                                  className="text-blue-500"
                                  isLink={true}
                                />
                              </div>
                              {row._linkNew ? <a href={row._linkNew} target="_blank" rel="noreferrer" className="p-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-600 hover:text-white shrink-0"><ExternalLink size={10} /></a> : <div className="p-1 bg-slate-50 text-slate-300 rounded border border-slate-100 cursor-not-allowed"><ExternalLink size={10} /></div>}
                            </div>
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[8px] font-bold text-slate-400 w-8">OLD:</span>
                              <div className="flex-1 min-w-0">
                                <EditableCell 
                                  value={row['Link File Lama']} 
                                  onSave={(val: string) => handleCellEdit(row._originalIndex, 'Link File Lama', val)}
                                  className="text-slate-500"
                                  isLink={true}
                                />
                              </div>
                              {row._linkOld ? <a href={row._linkOld} target="_blank" rel="noreferrer" className="p-1 bg-slate-50 text-slate-500 rounded hover:bg-slate-600 hover:text-white shrink-0"><History size={10} /></a> : <div className="p-1 bg-slate-50 text-slate-300 rounded border border-slate-100 cursor-not-allowed"><History size={10} /></div>}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-2.5 align-top">
                          <EditableCell 
                            value={row['Notes'] || ''} 
                            onSave={(val: string) => handleCellEdit(row._originalIndex, 'Notes', val)}
                            className="text-slate-600 font-medium whitespace-pre-wrap min-h-[48px] bg-white border border-slate-200 rounded-md !p-2"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

        ) : (
          
          <div className="h-full max-w-4xl mx-auto w-full animate-in fade-in duration-300">
             <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
                {!isAuthorized ? (
                  <div className="flex flex-col items-center justify-center flex-1 text-center bg-slate-50/30 px-6">
                     <div className="bg-white p-5 rounded-2xl mb-4 border border-slate-200 shadow-sm"><Lock size={28} className="text-slate-400" /></div>
                     <h2 className="text-lg font-black text-slate-800 mb-1 tracking-tight">Access Management Locked</h2>
                     <p className="text-[10px] font-bold text-slate-400 mb-6 uppercase tracking-[0.2em]">Authorized Personnel Only</p>
                     <div className="flex w-full max-w-xs gap-2">
                        <div className="relative flex-1">
                           <input type={showPassword ? 'text' : 'password'} value={passwordInput} onChange={(e: any) => setPasswordInput(e.target.value)} onKeyDown={(e: any) => { if(e.key === 'Enter') { if (passwordInput === 'MeratusAcademy') setIsAuthorized(true); else alert("Incorrect Password!"); } }} placeholder="Enter Password..." className="w-full h-[38px] bg-white border border-slate-300 px-3 rounded-lg text-[11px] font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none pr-8 shadow-inner" />
                           <button onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1">{showPassword ? <EyeOff size={14} /> : <Eye size={14} />}</button>
                        </div>
                        <button onClick={() => { if(passwordInput === 'MeratusAcademy') setIsAuthorized(true); else alert("Incorrect Password!"); }} className="bg-blue-600 hover:bg-blue-700 text-white px-5 h-[38px] rounded-lg text-[10px] font-black uppercase shadow-md transition-all active:scale-95">Unlock</button>
                     </div>
                  </div>
                ) : (
                  <>
                    <div className="px-5 py-3 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
                       <div className="flex items-center gap-2.5">
                         <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600"><FileSpreadsheet size={16} /></div>
                         <div><h2 className="text-[11px] font-black text-slate-800 uppercase tracking-tight leading-none">Global Data Source (TSV)</h2><p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Raw Tab-Separated Values Engine</p></div>
                       </div>
                       <div className="flex gap-2">
                          <button onClick={() => setIsAuthorized(false)} className="px-3 h-[32px] rounded-lg text-[9px] font-black uppercase border border-slate-200 hover:bg-slate-50 transition-colors">Lock</button>
                          <button onClick={handleSaveToCloud} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white px-4 h-[32px] rounded-lg text-[9px] font-black uppercase shadow-md transition-all flex items-center gap-2 disabled:opacity-70 active:scale-95">{isSaving ? <RefreshCw className="animate-spin" size={11} /> : <Save size={11} />} {isSaving ? 'Syncing...' : 'Sync to Cloud'}</button>
                       </div>
                    </div>
                    <div className="p-4 bg-slate-100/50 flex-1 flex min-h-0">
                      <textarea value={rawData} onChange={(e: any) => setRawData(e.target.value)} className="w-full h-full bg-white border border-slate-200 shadow-inner rounded-xl p-4 text-[10px] leading-relaxed font-mono text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none resize-none custom-scrollbar whitespace-pre" spellCheck="false" placeholder="Paste your TSV data here..."></textarea>
                    </div>
                  </>
                )}
             </div>
          </div>
        )}
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @media print {
           @page { size: A4 landscape; margin: 10mm; }
           body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background-color: white !important; color: black !important; }
        }
      `}} />
    </div>
  );
}
