import { PROPERTIES } from '../utils/reservationUtils';

const PropertyLegend = () => {
  return (
    <div className="rounded-lg border-2 border-indigo-100 p-4 space-y-4 bg-white/80 backdrop-blur-sm">
      <h3 className="font-semibold text-gray-700">Colores de Propiedades</h3>
      <div className="space-y-2">
        {PROPERTIES.map((property) => (
          <div key={property.id} className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded-full ${property.color}`} />
            <span className="text-gray-600">{property.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyLegend;