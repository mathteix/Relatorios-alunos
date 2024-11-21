const form = document.getElementById('report-form');
const reportsContainer = document.getElementById('reports');

// Função para carregar relatórios do LocalStorage
function loadReports() {
  return JSON.parse(localStorage.getItem('reports')) || [];
}

// Função para salvar relatórios no LocalStorage
function saveReports(reports) {
  localStorage.setItem('reports', JSON.stringify(reports));
}

// Função para exibir relatórios
function displayReports() {
  const reports = loadReports();
  reportsContainer.innerHTML = '';

  reports.forEach((report, index) => {
    const reportDiv = document.createElement('div');
    reportDiv.classList.add('report');
    reportDiv.innerHTML = `
      <h3>${report.type === 'individual' ? 'Relatório Individual' : 'Relatório da Turma'}</h3>
      <p><strong>Aluno:</strong> ${report.name}</p>
      <p><strong>Turma:</strong> ${report.class}</p>
      <p><strong>Professor(a):</strong> ${report.teacher}</p>
      <p><strong>Data:</strong> ${report.date}</p>
      <p>${report.text}</p>
      <div class="report-buttons">
        <button class="edit-btn" onclick="editReport(${index})">Editar</button>
        <button onclick="deleteReport(${index})">Excluir</button>
        <button class="print-btn" onclick="printReport(${index})">Imprimir</button>
        <button onclick="downloadPDF(${index})">Baixar PDF</button>
      </div>
    `;
    reportsContainer.appendChild(reportDiv);
  });
}

// Função para adicionar relatório
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const studentName = document.getElementById('student-name').value;
  const studentClass = document.getElementById('class').value;
  const teacherName = document.getElementById('teacher-name').value;
  const reportType = document.getElementById('report-type').value;
  const reportText = document.getElementById('report-text').value;
  

  const newReport = {
    name: studentName,
    class: studentClass,
    teacher: teacherName,
    type: reportType,
    text: reportText,
    date: new Date().toLocaleString(),
  };

  const reports = loadReports();
  reports.push(newReport);
  saveReports(reports);

  form.reset();
  displayReports();
});

// Função para excluir relatório
function deleteReport(index) {
  const reports = loadReports();
  reports.splice(index, 1);
  saveReports(reports);
  displayReports();
}

// Função para editar relatório
function editReport(index) {
  const reports = loadReports();
  const report = reports[index];

  document.getElementById('student-name').value = report.name;
  document.getElementById('class').value = report.class;
  document.getElementById('teacher-name').value = report.teacher;
  document.getElementById('report-type').value = report.type;
  document.getElementById('report-text').value = report.text;

  deleteReport(index);
}

// Função para imprimir relatório com cabeçalho estilizado e sem divisórias
function printReport(index) {
  const reports = loadReports();
  const report = reports[index];

  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head>
        <title>Relatório</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; padding: 2rem; }
          h1 { text-align: center; color: #ff7f11; }
          .header {
            padding: 1rem;
            margin-bottom: 2rem;
          }
          .header h1 {
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
          }
          .header p {
            margin: 0.3rem 0;
          }
          .report-content {
            white-space: pre-wrap; /* Preserve quebras de linha e espaços */
            background-color: #ffe5b4;
            padding: 1rem;
            border-radius: 10px;
            border: 1px solid #d38b1a;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Relatório Individual</h1>
          <p><strong>Instituição:</strong> Espaço Florescer</p>
          <p><strong>Professor(a):</strong> ${report.teacher}</p>
          <p><strong>Aluno(a):</strong> ${report.name}</p>
          <p><strong>Turma:</strong> ${report.class}</p>
        </div>
        <h1>Detalhes do Relatório</h1>
        <div class="report-content">${report.text}</div>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
}


// Função para baixar relatório em PDF
function downloadPDF(index) {
  const reports = loadReports();
  const report = reports[index];

  const docContent = `
    Relatório: ${report.type === 'individual' ? 'Individual' : 'Turma'}\n
    Nome do Aluno: ${report.name}\n
    Turma: ${report.class}\n
    Professor(a): ${report.teacher}\n
    Data: ${report.date}\n
    Conteúdo:\n${report.text}
  `;

  const blob = new Blob([docContent], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${report.name}-relatorio.pdf`;
  link.click();
}

// Carregar relatórios ao iniciar
document.addEventListener('DOMContentLoaded', displayReports);
