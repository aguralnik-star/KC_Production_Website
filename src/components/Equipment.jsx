import { Link } from 'react-router-dom';
import { Monitor, RotateCw, ScanLine, Box, ArrowRight } from 'lucide-react';

const equipment = [
  {
    icon: Monitor,
    category: 'CNC Milling Centers',
    items: ['Haas VF-2SS', 'Haas VF-3', 'Haas VF-4', 'Haas Mini Mill'],
    description: 'High-speed vertical machining centers for production and prototype work.',
  },
  {
    icon: RotateCw,
    category: 'CNC Turning',
    items: ['Haas ST-10', 'Haas ST-20', 'Haas SL-20'],
    description: 'CNC lathes for precision turned components and medium-volume production.',
  },
  {
    icon: ScanLine,
    category: 'Inspection Equipment',
    items: ['CMM Inspection', 'Calibrated Hand Tools', 'Surface Plate Inspection'],
    description: 'In-process and final inspection to verify dimensional accuracy and quality.',
  },
  {
    icon: Box,
    category: 'CAD/CAM Software',
    items: ['Mastercam Programming', 'Solid Model Import', 'Custom Post Processing'],
    description: 'Advanced programming for efficient toolpaths and consistent results.',
  },
];

export default function Equipment({ preview = false }) {
  return (
    <section className={`section-padding ${preview ? 'bg-white' : 'bg-slate-50'}`}>
      <div className="section-container">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="section-label">Equipment</p>
            <h2 className="section-title">{preview ? 'Modern CNC & Inspection' : 'Our Equipment & Technology'}</h2>
            <p className="section-subtitle">
              Haas CNC machines, CMM inspection, and Mastercam programming — invested in the equipment and software to deliver precision at scale.
            </p>
          </div>
          {preview && (
            <Link to="/equipment" className="btn-secondary shrink-0">
              View All Equipment
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {equipment.map(({ icon: Icon, category, items, description }) => (
            <div key={category} className="card">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-charcoal text-accent-light">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-charcoal">{category}</h3>
                  <p className="mt-1 text-sm text-metallic">{description}</p>
                  <ul className="mt-4 space-y-1.5">
                    {items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-charcoal">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
