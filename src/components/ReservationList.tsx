import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import ReservationHeader from "./reservation/ReservationHeader";
import ReservationClientInfo from "./reservation/ReservationClientInfo";
import ReservationPaymentInfo from "./reservation/ReservationPaymentInfo";
import ReservationActions from "./reservation/ReservationActions";
import { Reservation } from "@/types/types";

interface ReservationListProps {
  reservations: Reservation[];
  onEdit: (reservation: Reservation) => void;
  onDelete: (id: string) => void;
  highlightedPropertyId?: string;
}

const ReservationList = ({ 
  reservations, 
  onEdit, 
  onDelete,
  highlightedPropertyId 
}: ReservationListProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const formatCreatedAt = (date: string | undefined) => {
    if (!date) return "";
    return format(new Date(date), "dd/MM/yyyy HH:mm", { locale: es });
  };

  const handleWhatsAppClick = (phone: string) => {
    const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, "")}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="space-y-4">
      {reservations.map((reservation) => (
        <Card
          key={reservation.id}
          className={`p-4 ${
            highlightedPropertyId === reservation.propertyId
              ? "bg-gray-100 dark:bg-gray-800"
              : ""
          } transition-colors duration-200`}
        >
          <ReservationHeader
            userName={reservation.userName || null}
            createdAt={reservation.createdAt}
            formatCreatedAt={formatCreatedAt}
          />

          <div className="mt-2">
            <p className="text-lg font-semibold">
              {format(new Date(reservation.startDate), "dd/MM/yyyy", {
                locale: es,
              })}{" "}
              -{" "}
              {format(new Date(reservation.endDate), "dd/MM/yyyy", {
                locale: es,
              })}
            </p>
            <p className="text-lg font-bold text-primary">
              {formatCurrency(reservation.totalAmount)}
            </p>
          </div>

          <ReservationClientInfo client={reservation.client} />

          <Separator className="my-4" />

          <div className="space-y-2">
            <h4 className="font-medium">Pagos</h4>
            <ReservationPaymentInfo
              paymentMethods={reservation.paymentMethods}
              formatCurrency={formatCurrency}
            />
          </div>

          <ReservationActions
            phone={reservation.client.phone}
            onEdit={() => onEdit(reservation)}
            onDelete={() => onDelete(reservation.id)}
            onWhatsAppClick={handleWhatsAppClick}
          />
        </Card>
      ))}
    </div>
  );
};

export default ReservationList;