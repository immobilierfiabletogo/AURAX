import { NextRequest, NextResponse } from "next/server";

import { PaymentRepository } from "@/lib/repositories/payment.repository";
import { PaymentService } from "@/lib/services/payment.service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { paymentId } = body;

    if (!paymentId) {
      return NextResponse.json(
        {
          success: false,
          message: "paymentId est obligatoire.",
        },
        { status: 400 }
      );
    }

    const payment =
      await PaymentRepository.getPayment(paymentId);

    if (payment.error || !payment.data) {
      return NextResponse.json(
        {
          success: false,
          message: "Paiement introuvable.",
        },
        { status: 404 }
      );
    }

    if (payment.data.status !== "pending") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Ce paiement a déjà été traité.",
        },
        { status: 400 }
      );
    }

    const result = await PaymentService.approve(
      payment.data.id,
      payment.data.agent_id,
      payment.data.plan_requested as
        | "pro"
        | "premium",
      payment.data.months_requested
    );

    if (result.error) {
      return NextResponse.json(
        {
          success: false,
          message: result.error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Paiement approuvé avec succès.",
      data: result.data,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Une erreur est survenue.",
      },
      {
        status: 500,
      }
    );
  }
}