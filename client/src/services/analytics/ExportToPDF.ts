// src/services/analytics/AnalyticsExportService.ts

import { TimeSeriesPointDto } from "../../models/analytics/TimeSeriesPointDto";
import { BurndownDto } from "../../models/analytics/BurndownDto";
import { BurnupDto } from "../../models/analytics/BurnupDto";
import { BudgetTrackingDto } from "../../models/analytics/BudgetTrackingDto";
import { ProfitMarginDto } from "../../models/analytics/ProfitMarginDto";
import { ResourceCostAllocationDto } from "../../models/analytics/ResourceCostAllocationDto";
import { ProjectDTO } from "../../models/project/ProjectDTO";
import { imageToBase64 } from "../../helpers/imageToBase64";
import { ChartSVGGenerator } from "../../helpers/chartsToSvg";


interface Last30DaysPayload {
  projects: TimeSeriesPointDto[];
  workers: TimeSeriesPointDto[];
}

interface BurndownPayload {
  project: ProjectDTO;
  data: BurndownDto;
  sprintId: number;
}

interface BurnupPayload {
  project: ProjectDTO;
  data: BurnupDto;
  sprintId: number;
}

interface VelocityPayload {
  project: ProjectDTO;
  value: number;
}

interface BudgetPayload {
  project: ProjectDTO;
  data: BudgetTrackingDto;
}

interface ProfitMarginPayload {
  project: ProjectDTO;
  data: ProfitMarginDto;
}

interface ResourcesPayload {
  project: ProjectDTO;
  data: ResourceCostAllocationDto;
  usernamesById?: Record<number, string>;
}

export class AnalyticsExportService {
  private static formatDate(): string {
    const now = new Date();
    return `${now.getDate().toString().padStart(2, "0")}${(now.getMonth() + 1).toString().padStart(2, "0")}${now.getFullYear()}`;
  }

  private static formatDateDisplay(): string {
    const now = new Date();
    return `${now.getDate().toString().padStart(2, "0")}.${(now.getMonth() + 1).toString().padStart(2, "0")}.${now.getFullYear()}`;
  }

  private static async exportPDF(html: string, filename: string) {
    if (!window.electronAPI || !window.electronAPI.exportPdf) {
      console.error("Electron export API not available");
      alert("PDF export is not available in this environment.");
      return;
    }

    window.electronAPI.exportPdf({ html, filename });
    alert("PDF export initiated. Check your Downloads folder.");
  }

  private static async getLogoBase64(): Promise<string> {
    const logoUrl = window.electronAPI?.getLogoUrl();
    if (!logoUrl) return '';
    return await imageToBase64(logoUrl);
  }

  /**
   * LAST 30 DAYS
   */
  static async exportLast30Days(payload: Last30DaysPayload) {
    const dateStr = this.formatDate();
    const filename = `LAST30DAYS_${dateStr}.pdf`;
    const logoBase64 = await this.getLogoBase64();

    const projectsChart = ChartSVGGenerator.generateLineChart(
      payload.projects.map(p => ({ x: new Date(p.date).toLocaleDateString('sr-RS', { day: '2-digit', month: '2-digit' }), y: p.count })),
      '#38bdf8'
    );

    const workersChart = ChartSVGGenerator.generateLineChart(
      payload.workers.map(w => ({ x: new Date(w.date).toLocaleDateString('sr-RS', { day: '2-digit', month: '2-digit' }), y: w.count })),
      '#4ade80'
    );

    const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; background: #ffffff; color: #000; margin: 0; padding: 20px; }
              .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; padding-bottom: 10px; border-bottom: 2px solid #333; }
              .logo { height: 50px; }
              h2 { margin: 0; font-size: 24px; color: #333; }
              .date { font-size: 14px; color: #666; }
              .section { margin-bottom: 40px; page-break-inside: avoid; }
              h3 { color: #333; margin-bottom: 15px; font-size: 18px; }
              .chart-container { margin: 20px 0; text-align: center; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
              th { background-color: #f0f0f0; font-weight: bold; }
              tr:nth-child(even) { background-color: #f9f9f9; }
              footer { font-size: 10px; text-align: center; margin-top: 40px; padding-top: 10px; border-top: 1px solid #ddd; color: #666; }
            </style>
          </head>
          <body>
            <div class="header">
              ${logoBase64 ? `<img src="${logoBase64}" class="logo" alt="Logo" />` : '<div></div>'}
              <h2>LAST 30 DAYS ANALYTICS</h2>
              <span class="date">${this.formatDateDisplay()}</span>
            </div>

            <div class="section">
              <h3>Projects Started (Last 30 Days)</h3>
              <div class="chart-container">${projectsChart}</div>
              <table>
                <thead><tr><th>Date</th><th>Count</th></tr></thead>
                <tbody>
                  ${payload.projects.map(p => `<tr><td>${new Date(p.date).toLocaleDateString('sr-RS')}</td><td>${p.count}</td></tr>`).join("")}
                </tbody>
              </table>
            </div>

            <div class="section">
              <h3>Workers Added (Last 30 Days)</h3>
              <div class="chart-container">${workersChart}</div>
              <table>
                <thead><tr><th>Date</th><th>Count</th></tr></thead>
                <tbody>
                  ${payload.workers.map(w => `<tr><td>${new Date(w.date).toLocaleDateString('sr-RS')}</td><td>${w.count}</td></tr>`).join("")}
                </tbody>
              </table>
            </div>

             <footer>Generated by Analytics Team from A2 Pictures · ${dateStr}</footer>
          </body>
        </html>
        `;

    await this.exportPDF(html, filename);
  }

  /**
   * BURNDOWN
   */
  static async exportBurndown(payload: BurndownPayload) {
    const { project, data, sprintId } = payload;
    const dateStr = this.formatDate();
    const projectName = project.project_name?.replace(/[^a-zA-Z0-9]/g, '') || `PROJ${project.project_id}`;
    const filename = `BURNDOWN_${projectName}_SPRINT${sprintId}_${dateStr}.pdf`;
    const logoBase64 = await this.getLogoBase64();

    const tasksHTML = data.tasks.map(task => `
            <div class="task-item">
                <h4>Task ${task.task_id}</h4>
                <div class="progress-bars">
                    <div class="progress-row">
                        <span class="progress-label">Ideal Progress:</span>
                        <div class="progress-bar">
                            <div class="progress-fill ideal" style="width: ${task.ideal_progress}%"></div>
                            <span class="progress-text">${task.ideal_progress.toFixed(1)}%</span>
                        </div>
                    </div>
                    <div class="progress-row">
                        <span class="progress-label">Real Progress:</span>
                        <div class="progress-bar">
                            <div class="progress-fill real" style="width: ${task.real_progress}%"></div>
                            <span class="progress-text">${task.real_progress.toFixed(1)}%</span>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

    const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; background: #ffffff; color: #000; margin: 0; padding: 20px; }
              .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; padding-bottom: 10px; border-bottom: 2px solid #333; }
              .logo { height: 50px; }
              h2 { margin: 0; font-size: 24px; color: #333; }
              .date { font-size: 14px; color: #666; }
              .meta { font-size: 14px; color: #666; margin-bottom: 20px; }
              .task-item { margin-bottom: 30px; page-break-inside: avoid; background: #f9f9f9; padding: 15px; border-radius: 8px; }
              h4 { margin: 0 0 15px 0; color: #333; }
              .progress-row { margin-bottom: 10px; }
              .progress-label { display: inline-block; width: 120px; font-size: 12px; color: #666; }
              .progress-bar { display: inline-block; width: calc(100% - 130px); height: 24px; background: #e5e5e5; border-radius: 4px; position: relative; }
              .progress-fill { height: 100%; border-radius: 4px; transition: width 0.3s; }
              .progress-fill.ideal { background: #60A5FA; }
              .progress-fill.real { background: #FACC15; }
              .progress-text { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); font-size: 11px; font-weight: bold; color: #333; }
              footer { font-size: 10px; text-align: center; margin-top: 40px; padding-top: 10px; border-top: 1px solid #ddd; color: #666; }
            </style>
          </head>
          <body>
            <div class="header">
              ${logoBase64 ? `<img src="${logoBase64}" class="logo" alt="Logo" />` : '<div></div>'}
              <h2>BURNDOWN ANALYTICS</h2>
              <span class="date">${this.formatDateDisplay()}</span>
            </div>

            <div class="meta">
              <strong>Project:</strong> ${project.project_name || `Project ${project.project_id}`} | 
              <strong>Sprint:</strong> ${sprintId}
            </div>

            ${tasksHTML}

             <footer>Generated by Analytics Team from A2 Pictures · ${dateStr}</footer>
          </body>
        </html>
        `;

    await this.exportPDF(html, filename);
  }

  /**
   * BURNUP
   */
  static async exportBurnup(payload: BurnupPayload) {
    const { project, data, sprintId } = payload;
    const dateStr = this.formatDate();
    const projectName = project.project_name?.replace(/[^a-zA-Z0-9]/g, '') || `PROJ${project.project_id}`;
    const filename = `BURNUP_${projectName}_SPRINT${sprintId}_${dateStr}.pdf`;
    const logoBase64 = await this.getLogoBase64();

    const chart = ChartSVGGenerator.generateLineChart(
      data.points.map(p => ({ x: p.x, y: p.y })),
      '#4ade80',
      600,
      300
    );

    const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; background: #ffffff; color: #000; margin: 0; padding: 20px; }
              .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; padding-bottom: 10px; border-bottom: 2px solid #333; }
              .logo { height: 50px; }
              h2 { margin: 0; font-size: 24px; color: #333; }
              .date { font-size: 14px; color: #666; }
              .meta { font-size: 14px; color: #666; margin-bottom: 20px; }
              .chart-container { margin: 20px 0; text-align: center; }
              .stats { display: flex; justify-content: space-around; margin-top: 30px; }
              .stat-box { background: #f9f9f9; padding: 15px; border-radius: 8px; text-align: center; }
              .stat-label { font-size: 12px; color: #666; }
              .stat-value { font-size: 24px; font-weight: bold; color: #333; margin-top: 5px; }
              footer { font-size: 10px; text-align: center; margin-top: 40px; padding-top: 10px; border-top: 1px solid #ddd; color: #666; }
            </style>
          </head>
          <body>
            <div class="header">
              ${logoBase64 ? `<img src="${logoBase64}" class="logo" alt="Logo" />` : '<div></div>'}
              <h2>BURNUP ANALYTICS</h2>
              <span class="date">${this.formatDateDisplay()}</span>
            </div>

            <div class="meta">
              <strong>Project:</strong> ${project.project_name || `Project ${project.project_id}`} | 
              <strong>Sprint:</strong> ${sprintId}
            </div>

            <div class="chart-container">${chart}</div>

            <div class="stats">
              <div class="stat-box">
                <div class="stat-label">Sprint Duration</div>
                <div class="stat-value">${data.sprint_duration_date} days</div>
              </div>
              <div class="stat-box">
                <div class="stat-label">Total Work</div>
                <div class="stat-value">${data.work_amount}h</div>
              </div>
            </div>

             <footer>Generated by Analytics Team from A2 Pictures · ${dateStr}</footer>
          </body>
        </html>
        `;

    await this.exportPDF(html, filename);
  }

  /**
   * VELOCITY
   */
  static async exportVelocity(payload: VelocityPayload) {
    const { project, value } = payload;
    const dateStr = this.formatDate();
    const projectName = project.project_name?.replace(/[^a-zA-Z0-9]/g, '') || `PROJ${project.project_id}`;
    const filename = `VELOCITY_${projectName}_${dateStr}.pdf`;
    const logoBase64 = await this.getLogoBase64();

    const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; background: #ffffff; color: #000; margin: 0; padding: 20px; }
              .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; padding-bottom: 10px; border-bottom: 2px solid #333; }
              .logo { height: 50px; }
              h2 { margin: 0; font-size: 24px; color: #333; }
              .date { font-size: 14px; color: #666; }
              .meta { font-size: 14px; color: #666; margin-bottom: 20px; }
              .velocity-display { text-align: center; padding: 60px 20px; }
              .velocity-label { font-size: 20px; color: #666; margin-bottom: 20px; }
              .velocity-value { font-size: 72px; font-weight: bold; color: #333; }
              .velocity-description { font-size: 14px; color: #666; margin-top: 30px; max-width: 600px; margin-left: auto; margin-right: auto; }
              footer { font-size: 10px; text-align: center; margin-top: 40px; padding-top: 10px; border-top: 1px solid #ddd; color: #666; }
            </style>
          </head>
          <body>
            <div class="header">
              ${logoBase64 ? `<img src="${logoBase64}" class="logo" alt="Logo" />` : '<div></div>'}
              <h2>VELOCITY ANALYTICS</h2>
              <span class="date">${this.formatDateDisplay()}</span>
            </div>

            <div class="meta">
              <strong>Project:</strong> ${project.project_name || `Project ${project.project_id}`}
            </div>

            <div class="velocity-display">
              <div class="velocity-label">Team Velocity</div>
              <div class="velocity-value">${value.toFixed(1)}h</div>
              <div class="velocity-description">
                Average team hours spent per sprint across completed sprints.
              </div>
            </div>

             <footer>Generated by Analytics Team from A2 Pictures · ${dateStr}</footer>
          </body>
        </html>
        `;

    await this.exportPDF(html, filename);
  }

  /**
   * BUDGET
   */
  static async exportBudget(payload: BudgetPayload) {
    const { project, data } = payload;
    const dateStr = this.formatDate();
    const projectName = project.project_name?.replace(/[^a-zA-Z0-9]/g, '') || `PROJ${project.project_id}`;
    const filename = `BUDGET_${projectName}_${dateStr}.pdf`;
    const logoBase64 = await this.getLogoBase64();

    const chartData = [
      { name: "Planned Budget", value: data.allowed_budget, color: "rgba(96, 165, 250, 0.6)" },
      { name: "Actual Cost", value: data.total_spent, color: "rgba(74, 222, 128, 0.6)" },
      {
        name: "Remaining Budget",
        value: data.remaining_budget,
        color: data.remaining_budget >= 0 ? "rgba(250, 204, 21, 0.6)" : "rgba(248, 113, 113, 0.6)"
      }
    ];

    const chart = ChartSVGGenerator.generateBarChart(chartData, 600, 350);

    const html = `<!DOCTYPE html>         <html>           <head>             <meta charset="UTF-8">             <style>               body { font-family: Arial, sans-serif; background: #ffffff; color: #000; margin: 0; padding: 20px; }               .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; padding-bottom: 10px; border-bottom: 2px solid #333; }               .logo { height: 50px; }               h2 { margin: 0; font-size: 24px; color: #333; }               .date { font-size: 14px; color: #666; }               .meta { font-size: 14px; color: #666; margin-bottom: 20px; }               .chart-container { margin: 20px 0; text-align: center; }               .stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-top: 30px; }               .stat-box { background: #f9f9f9; padding: 15px; border-radius: 8px; }               .stat-label { font-size: 12px; color: #666; }               .stat-value { font-size: 20px; font-weight: bold; color: #333; margin-top: 5px; }               footer { font-size: 10px; text-align: center; margin-top: 40px; padding-top: 10px; border-top: 1px solid #ddd; color: #666; }             </style>           </head>           <body>             <div class="header">               ${logoBase64 ? `<img src="${logoBase64}" class="logo" alt="Logo" />` : '<div></div>'}
<h2>BUDGET TRACKING</h2>
<span class="date">${this.formatDateDisplay()}</span>
</div>
<div class="meta">
          <strong>Project:</strong> ${project.project_name || `Project ${project.project_id}`}
        </div>

        <div class="chart-container">${chart}</div>

        <div class="stats">
          <div class="stat-box">
            <div class="stat-label">Planned Budget</div>
            <div class="stat-value">${data.allowed_budget.toFixed(2)} ¥</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Actual Cost</div>
            <div class="stat-value">${data.total_spent.toFixed(2)} ¥</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Remaining Budget</div>
            <div class="stat-value" style="color: ${data.remaining_budget >= 0 ? '#4ADE80' : '#F87171'}">${data.remaining_budget.toFixed(2)} ¥</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Variance</div>
            <div class="stat-value">${data.variance.toFixed(2)} ¥</div>
          </div>
        </div>

         <footer>Generated by Analytics Team from A2 Pictures · ${dateStr}</footer>
      </body>
    </html>
    `;

    await this.exportPDF(html, filename);
  }

  /**
   * PROFIT MARGIN
   */
  static async exportProfitMargin(payload: ProfitMarginPayload) {
    const { project, data } = payload;
    const dateStr = this.formatDate();
    const projectName = project.project_name?.replace(/[^a-zA-Z0-9]/g, '') || `PROJ${project.project_id}`;
    const filename = `PROFITMARGIN_${projectName}_${dateStr}.pdf`;
    const logoBase64 = await this.getLogoBase64();

    const allowed = Number(data.allowed_budget ?? 0);
    const cost = Number(data.total_cost ?? 0);
    const profit = Number(data.profit ?? 0);
    const margin = Number(data.profit_margin_percentage ?? 0);

    const used = Math.min(cost, Math.max(allowed, 0));
    const remaining = Math.max(allowed - used, 0);

    const donutData = allowed > 0
      ? [
        { name: "Used", value: used, color: "rgba(96, 165, 250, 0.6)" },
        { name: "Remaining", value: remaining, color: "rgba(250, 204, 21, 0.6)" }
      ]
      : [{ name: "Cost", value: Math.max(cost, 0) || 1, color: "rgba(248, 113, 113, 0.6)" }];

    const donutChart = ChartSVGGenerator.generateDonutChart(donutData, 300, 300, 65);

    const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; background: #ffffff; color: #000; margin: 0; padding: 20px; }
          .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; padding-bottom: 10px; border-bottom: 2px solid #333; }
          .logo { height: 50px; }
          h2 { margin: 0; font-size: 24px; color: #333; }
          .date { font-size: 14px; color: #666; }
          .meta { font-size: 14px; color: #666; margin-bottom: 20px; }
          .content { display: flex; gap: 30px; align-items: center; }
          .chart-container { flex: 0 0 300px; text-align: center; position: relative; }
          .chart-label { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; }
          .chart-label-value { font-size: 32px; font-weight: bold; color: ${profit >= 0 ? '#4ADE80' : '#F87171'}; }
          .stats { flex: 1; display: grid; grid-template-columns: 1fr; gap: 15px; }
          .stat-box { background: #f9f9f9; padding: 15px; border-radius: 8px; }
          .stat-label { font-size: 12px; color: #666; }
          .stat-value { font-size: 20px; font-weight: bold; color: #333; margin-top: 5px; }
          footer { font-size: 10px; text-align: center; margin-top: 40px; padding-top: 10px; border-top: 1px solid #ddd; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          ${logoBase64 ? `<img src="${logoBase64}" class="logo" alt="Logo" />` : '<div></div>'}
          <h2>PROFIT MARGIN ANALYTICS</h2>
          <span class="date">${this.formatDateDisplay()}</span>
        </div>

        <div class="meta">
          <strong>Project:</strong> ${project.project_name || `Project ${project.project_id}`}
        </div>

        <div class="content">
          <div class="chart-container">
            ${donutChart}
            <div class="chart-label">
              <div style="font-size: 12px; color: #666;">Profit Margin</div>
              <div class="chart-label-value">${margin.toFixed(2)}%</div>
            </div>
          </div>

          <div class="stats">
            <div class="stat-box">
              <div class="stat-label">Allowed Budget</div>
              <div class="stat-value">${allowed.toFixed(2)} ¥</div>
            </div>
            <div class="stat-box">
              <div class="stat-label">Total Cost</div>
              <div class="stat-value">${cost.toFixed(2)} ¥</div>
            </div>
            <div class="stat-box">
              <div class="stat-label">${profit >= 0 ? 'Profit' : 'Loss'}</div>
              <div class="stat-value" style="color: ${profit >= 0 ? '#4ADE80' : '#F87171'}">${profit.toFixed(2)} ¥</div>
            </div>
            <div class="stat-box">
              <div class="stat-label">Profit Margin</div>
              <div class="stat-value" style="color: ${profit >= 0 ? '#4ADE80' : '#F87171'}">${margin.toFixed(2)}%</div>
            </div>
          </div>
        </div>

         <footer>Generated by Analytics Team from A2 Pictures · ${dateStr}</footer>
      </body>
    </html>
    `;

    await this.exportPDF(html, filename);
  }

  /**
   * RESOURCES
   */
  static async exportResources(payload: ResourcesPayload) {
    const { project, data, usernamesById = {} } = payload;
    const dateStr = this.formatDate();
    const projectName = project.project_name?.replace(/[^a-zA-Z0-9]/g, '') || `PROJ${project.project_id}`;
    const filename = `RESOURCES_${projectName}_${dateStr}.pdf`;
    const logoBase64 = await this.getLogoBase64();

    const resources = Array.isArray((data as any).resources) ? (data as any).resources : [];
    const total = resources.reduce((sum: number, r: any) => sum + Number(r.total_cost ?? 0), 0);

    const chartData = resources
      .map((r: any) => ({
        name: usernamesById[Number(r.user_id)] ?? `User ${r.user_id}`,
        value: Number(r.total_cost ?? 0),
        color: "rgba(96, 165, 250, 0.6)"
      }))
      .sort((a: any, b: any) => b.value - a.value);

    const chart = ChartSVGGenerator.generateHorizontalBarChart(chartData, 600, Math.max(300, chartData.length * 40));

    const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; background: #ffffff; color: #000; margin: 0; padding: 20px; }
          .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; padding-bottom: 10px; border-bottom: 2px solid #333; }
          .logo { height: 50px; }
          h2 { margin: 0; font-size: 24px; color: #333; }
          .date { font-size: 14px; color: #666; }
          .meta { font-size: 14px; color: #666; margin-bottom: 20px; }
          .total { font-size: 18px; font-weight: bold; margin-bottom: 20px; }
          .chart-container { margin: 20px 0; text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 30px; font-size: 12px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f0f0f0; font-weight: bold; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          footer { font-size: 10px; text-align: center; margin-top: 40px; padding-top: 10px; border-top: 1px solid #ddd; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          ${logoBase64 ? `<img src="${logoBase64}" class="logo" alt="Logo" />` : '<div></div>'}
          <h2>RESOURCE COST ALLOCATION</h2>
          <span class="date">${this.formatDateDisplay()}</span>
        </div>

        <div class="meta">
          <strong>Project:</strong> ${project.project_name || `Project ${project.project_id}`}
        </div>

        <div class="total">Total Cost: ${total.toFixed(2)} ¥</div>

        <div class="chart-container">${chart}</div>

        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Cost (¥)</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            ${chartData.map((item: any) => {
      const percent = total > 0 ? (item.value / total * 100).toFixed(1) : '0.0';
      return `<tr>
                  <td>${item.name}</td>
                  <td>${item.value.toFixed(2)}</td>
                  <td>${percent}%</td>
                </tr>`;
    }).join('')}
          </tbody>
        </table>

         <footer>Generated by Analytics Team from A2 Pictures · ${dateStr}</footer>
      </body>
    </html>
    `;

    await this.exportPDF(html, filename);
  }
}