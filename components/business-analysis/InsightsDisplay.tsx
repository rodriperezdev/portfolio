'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';

interface Insight {
  priority: string;
  category: string;
  title: string;
  description: string;
  recommendations: string[];
}

interface InsightsDisplayProps {
  insights: Insight[];
  translations: any;
  language?: string;
}

// Translation mapping for insights
const insightTranslations: Record<string, Record<string, string>> = {
  en: {},
  es: {
    // Titles
    'Gross Margin Below Target': 'Margen Bruto por Debajo del Objetivo',
    'Net Margin Below Target': 'Margen Neto por Debajo del Objetivo',
    'Unsustainable Customer Acquisition': 'Adquisición de Clientes Insostenible',
    'Growth Opportunity': 'Oportunidad de Crecimiento',
    'Long CAC Payback Period': 'Período de Recuperación CAC Largo',
    'Low Cash Runway': 'Reserva de Efectivo Baja',
    'Moderate Cash Runway': 'Reserva de Efectivo Moderada',
    'High Burn Multiple': 'Múltiplo de Quema Alto',
    'High Customer Churn': 'Alta Tasa de Abandono de Clientes',
    'Excellent Customer Retention': 'Excelente Retención de Clientes',
    
    // Common phrases in descriptions
    'Your gross margin of': 'Tu margen bruto de',
    'is below the': 'está por debajo del',
    'industry standard of': 'estándar de la industria de',
    'for argentina': 'para argentina',
    'for brazil': 'para brasil',
    'for chile': 'para chile',
    'for usa': 'para estados unidos',
    'Note: In ARGENTINA': 'Nota: En ARGENTINA',
    'Note: In BRAZIL': 'Nota: En BRASIL',
    'Note: In CHILE': 'Nota: En CHILE',
    'Note: In USA': 'Nota: En ESTADOS UNIDOS',
    'High inflation environment requires focus on pricing power and USD-linked contracts': 'El entorno de alta inflación requiere enfocarse en el poder de fijación de precios y contratos vinculados al USD',
    'Large market with strong digital adoption - focus on scale and efficiency': 'Mercado grande con fuerte adopción digital - enfócate en escala y eficiencia',
    'Most stable LATAM economy - benchmarks closer to developed markets': 'Economía más estable de LATAM - benchmarks más cercanos a mercados desarrollados',
    'Highly competitive market requiring strong unit economics': 'Mercado altamente competitivo que requiere una fuerte economía unitaria',
    'Your net margin of': 'Tu margen neto de',
    'LTV:CAC ratio of': 'Ratio LTV:CAC de',
    'indicates you\'re spending': 'indica que estás gastando',
    'too much to acquire customers relative to their lifetime value.': 'demasiado para adquirir clientes en relación a su valor de vida.',
    'suggests room to invest more': 'sugiere espacio para invertir más',
    'in customer acquisition to accelerate growth.': 'en adquisición de clientes para acelerar el crecimiento.',
    'CAC payback period of': 'Período de recuperación CAC de',
    'months is longer than ideal.': 'meses es más largo de lo ideal.',
    'This impacts cash flow and growth velocity.': 'Esto impacta el flujo de efectivo y la velocidad de crecimiento.',
    'With only': 'Con solo',
    'months of runway, immediate action is required.': 'meses de reserva, se requiere acción inmediata.',
    'months of runway requires proactive planning.': 'meses de reserva requiere planificación proactiva.',
    'Burn multiple of': 'Múltiplo de quema de',
    'indicates high burn rate': 'indica una alta tasa de quema',
    'relative to revenue growth.': 'relativa al crecimiento de ingresos.',
    'Monthly churn rate of': 'Tasa de abandono mensual de',
    '% is eroding your customer base.': '% está erosionando tu base de clientes.',
    'Churn rate of': 'Tasa de abandono de',
    '% indicates strong customer satisfaction.': '% indica una fuerte satisfacción del cliente.',
    
    // Recommendations
    'Negotiate better supplier rates or find alternative vendors': 'Negocia mejores tarifas con proveedores o encuentra proveedores alternativos',
    'Increase prices where market allows': 'Aumenta los precios donde el mercado lo permita',
    'Reduce production costs through automation or process improvements': 'Reduce los costos de producción mediante automatización o mejoras de procesos',
    'Review and optimize operating expenses': 'Revisa y optimiza los gastos operativos',
    'Focus on high-margin revenue streams': 'Enfócate en flujos de ingresos de alto margen',
    'Consider automating manual processes to reduce costs': 'Considera automatizar procesos manuales para reducir costos',
    'Reduce paid advertising spend and focus on organic channels': 'Reduce el gasto en publicidad pagada y enfócate en canales orgánicos',
    'Improve conversion rates through A/B testing': 'Mejora las tasas de conversión mediante pruebas A/B',
    'Increase customer lifetime value through upsells and retention programs': 'Aumenta el valor de vida del cliente mediante ventas adicionales y programas de retención',
    'Optimize sales and marketing processes to reduce CAC': 'Optimiza los procesos de ventas y marketing para reducir el CAC',
    'Increase sales & marketing budget to accelerate growth': 'Aumenta el presupuesto de ventas y marketing para acelerar el crecimiento',
    'Expand into new channels or markets': 'Expande a nuevos canales o mercados',
    'Scale successful campaigns': 'Escala campañas exitosas',
    'Consider raising capital to fund growth': 'Considera recaudar capital para financiar el crecimiento',
    'Focus on improving conversion rates': 'Enfócate en mejorar las tasas de conversión',
    'Optimize pricing strategy': 'Optimiza la estrategia de precios',
    'Target higher-value customer segments': 'Dirígete a segmentos de clientes de mayor valor',
    'Reduce operating expenses immediately': 'Reduce los gastos operativos inmediatamente',
    'Accelerate revenue collection (shorten payment terms)': 'Acelera la recaudación de ingresos (acorta los términos de pago)',
    'Begin fundraising process or explore bridge financing': 'Inicia el proceso de recaudación de fondos o explora financiamiento puente',
    'Focus on highest-margin revenue opportunities': 'Enfócate en las oportunidades de ingresos de mayor margen',
    'Plan fundraising timeline if not yet profitable': 'Planifica la línea de tiempo de recaudación de fondos si aún no eres rentable',
    'Identify and eliminate non-essential expenses': 'Identifica y elimina gastos no esenciales',
    'Consider extending payment terms with suppliers': 'Considera extender los términos de pago con proveedores',
    'Focus on improving revenue growth efficiency': 'Enfócate en mejorar la eficiencia del crecimiento de ingresos',
    'Review and optimize spending across all departments': 'Revisa y optimiza el gasto en todos los departamentos',
    'Ensure spending aligns with revenue-generating activities': 'Asegúrate de que el gasto se alinee con actividades generadoras de ingresos',
    'Implement customer success program to identify at-risk accounts': 'Implementa un programa de éxito del cliente para identificar cuentas en riesgo',
    'Conduct exit interviews to understand churn reasons': 'Realiza entrevistas de salida para entender las razones del abandono',
    'Add features or improve product based on customer feedback': 'Agrega características o mejora el producto basado en comentarios de clientes',
    'Improve onboarding experience': 'Mejora la experiencia de incorporación',
    'Create retention campaigns for at-risk segments': 'Crea campañas de retención para segmentos en riesgo',
    'Leverage low churn to focus on expansion revenue': 'Aprovecha el bajo abandono para enfocarte en ingresos de expansión',
    'Consider referral programs to capitalize on satisfied customers': 'Considera programas de referidos para capitalizar clientes satisfechos',
    'Use retention success as a sales differentiator': 'Usa el éxito de retención como diferenciador de ventas',
  },
};

// Function to translate insight text
function translateInsight(text: string, language: string): string {
  if (language === 'en' || !insightTranslations[language]) {
    return text;
  }
  
  const translations = insightTranslations[language];
  
  // Try to find exact match first
  if (translations[text]) {
    return translations[text];
  }
  
  // Try to translate common patterns
  // Sort by length (longest first) to avoid partial replacements
  let translated = text;
  const sortedEntries = Object.entries(translations).sort((a, b) => b[0].length - a[0].length);
  
  for (const [en, es] of sortedEntries) {
    if (translated.includes(en)) {
      translated = translated.replace(new RegExp(en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), es);
    }
  }
  
  return translated;
}

function InsightsDisplay({ insights, translations: t, language = 'en' }: InsightsDisplayProps) {
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'medium':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'low':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-50 dark:bg-red-950/30 border-red-500 dark:border-red-400 text-red-900 dark:text-red-100';
      case 'high':
        return 'bg-orange-50 dark:bg-orange-950/30 border-orange-500 dark:border-orange-400 text-orange-900 dark:text-orange-100';
      case 'medium':
        return 'bg-blue-50 dark:bg-blue-950/30 border-blue-500 dark:border-blue-400 text-blue-900 dark:text-blue-100';
      case 'low':
        return 'bg-green-50 dark:bg-green-950/30 border-green-500 dark:border-green-400 text-green-900 dark:text-green-100';
      default:
        return 'bg-gray-50 dark:bg-gray-950/30 border-gray-500 dark:border-gray-400 text-gray-900 dark:text-gray-100';
    }
  };

  if (insights.length === 0) {
    return (
      <Card className="p-6 border-2 border-black">
        <div className="text-center py-8">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <p className="text-lg font-medium">{t.insights.noInsights}</p>
        </div>
      </Card>
    );
  }

  // Sort insights by priority
  const sortedInsights = [...insights].sort((a, b) => {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return (priorityOrder[a.priority as keyof typeof priorityOrder] || 99) - 
           (priorityOrder[b.priority as keyof typeof priorityOrder] || 99);
  });

  return (
    <Card className="p-6 border-2 border-black">
      <h2 className="text-2xl font-bold mb-6">{t.insights.title}</h2>
      <div className="space-y-4">
        {sortedInsights.map((insight, index) => (
          <div
            key={index}
            className={`p-4 border-2 rounded-lg ${getPriorityColor(insight.priority)}`}
          >
            <div className="flex items-start gap-3">
              {getPriorityIcon(insight.priority)}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold font-bold">{translateInsight(insight.title, language)}</h3>
                  <Badge variant="outline" className="border-current">
                    {t.insights.categories[insight.category as keyof typeof t.insights.categories] || insight.category}
                  </Badge>
                </div>
                <p className="text-sm mb-3 font-medium">{translateInsight(insight.description, language)}</p>
                {insight.recommendations.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-current/20">
                    <p className="text-sm font-bold mb-2">{t.insights.recommendations}:</p>
                    <ul className="list-disc list-inside space-y-1.5 text-sm font-medium">
                      {insight.recommendations.map((rec, recIndex) => (
                        <li key={recIndex} className="leading-relaxed">{translateInsight(rec, language)}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export { InsightsDisplay };
