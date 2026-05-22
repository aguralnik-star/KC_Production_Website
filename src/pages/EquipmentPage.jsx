import { Link } from 'react-router-dom';
import Equipment from '../components/Equipment';
import { ArrowRight, Monitor, RotateCw, ScanLine, Layers } from 'lucide-react';

const sections = [
  {
    icon: Monitor,
    title: 'CNC Milling Centers',
    description: 'Our Haas vertical machining centers handle everything from quick-turn prototypes to recurring production runs. High spindle speeds, rigid construction, and proven reliability keep parts on schedule and on spec.',
    machines: [
      { name: 'Haas VF-2SS', spec: 'High-speed super-speed mill, ideal for aluminum and production work' },
      { name: 'Haas VF-3', spec: 'Versatile 3-axis VMC for medium-sized components and tooling' },
      { name: 'Haas VF-4', spec: 'Large envelope milling for bigger parts and fixture work' },
      { name: 'Haas Mini Mill', spec: 'Compact mill for small parts, secondary ops, and quick prototypes' },
    ],
  },
  {
    icon: RotateCw,
    title: 'CNC Turning',
    description: 'Haas CNC lathes deliver consistent turned components with tight concentricity and surface finish requirements. From single prototypes to scheduled production, our turning capacity supports a wide range of part sizes.',
    machines: [
      { name: 'Haas ST-10', spec: 'Compact turning center for small to medium diameter parts' },
      { name: 'Haas ST-20', spec: 'High-performance turning with live tooling capability' },
      { name: 'Haas SL-20', spec: 'Slant-bed lathe for efficient chip evacuation and rigidity' },
    ],
  },
  {
    icon: ScanLine,
    title: 'Inspection Equipment',
    description: 'Quality verification is integral to our process. CMM inspection, calibrated hand tools, and surface plate work ensure every critical dimension is verified before parts ship to your facility.',
    machines: [
      { name: 'CMM Inspection', spec: 'Coordinate measuring for complex geometries and tight tolerances' },
      { name: 'Calibrated Hand Tools', spec: 'Micrometers, calipers, height gauges, and bore gauges' },
      { name: 'Surface Plate Inspection', spec: 'Flatness, parallelism, and datum verification' },
      { name: 'First Article Reports', spec: 'Documented inspection results available upon request' },
    ],
  },
  {
    icon: Layers,
    title: 'CAD/CAM Software',
    description: 'Mastercam programming drives efficient toolpaths across our CNC fleet. We import solid models, optimize cycles for production, and maintain consistent programming standards across all jobs.',
    machines: [
      { name: 'Mastercam', spec: 'Full 3D programming for milling and turning operations' },
      { name: 'Solid Model Import', spec: 'STEP, IGES, Parasolid, and native CAD formats' },
      { name: 'Custom Post Processing', spec: 'Machine-specific posts for consistent, safe toolpaths' },
      { name: 'Simulation & Verification', spec: 'Virtual verification before chips hit the floor' },
    ],
  },
];

export default function EquipmentPage() {
  return (
    <>
      <section className="bg-charcoal py-16 sm:py-20">
        <div className="section-container px-4 sm:px-6 lg:px-8">
          <p className="section-label text-accent-light">Equipment</p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">Invested in the Tools That Deliver Precision</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">
            Haas CNC machines, CMM inspection, and Mastercam programming — the equipment and software stack behind every part we ship.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="section-container space-y-12">
          {sections.map(({ icon: Icon, title, description, machines }) => (
            <div key={title} className="card overflow-hidden p-0">
              <div className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50 p-6 sm:flex-row sm:items-start sm:gap-6 sm:p-8">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-charcoal text-accent-light">
                  <Icon className="h-7 w-7" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-charcoal">{title}</h2>
                  <p className="mt-2 leading-relaxed text-metallic">{description}</p>
                </div>
              </div>
              <div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-8">
                {machines.map(({ name, spec }) => (
                  <div key={name} className="rounded-lg border border-slate-100 bg-white p-4">
                    <p className="font-semibold text-charcoal">{name}</p>
                    <p className="mt-1 text-sm text-metallic">{spec}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Equipment />

      <section className="section-padding bg-charcoal">
        <div className="section-container text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Ready to Put Our Equipment to Work?</h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-400">Share your project requirements and we&apos;ll match the right process and machine to your needs.</p>
          <Link to="/contact" className="btn-primary mt-8">Request a Quote<ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </>
  );
}
