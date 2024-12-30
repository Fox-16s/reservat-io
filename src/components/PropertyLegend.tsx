import { PROPERTIES } from '../utils/reservationUtils';

const PropertyLegend = () => {
  return (
    <div className="relative">
      <span className="absolute -top-6 left-0 text-sm font-medium text-gray-600">
        Referencias
      </span>
      <div className="rounded-lg border-2 border-indigo-100 p-4 space-y-4 bg-white/80 backdrop-blur-sm">
        <div className="space-y-2">
          {PROPERTIES.map((property) => (
            <div key={property.id} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full ${property.color}`} />
              <span className="text-gray-600 absolute left-full ml-2">{property.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyLegend;