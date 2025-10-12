"use server"

export async function DeletePendingOrder(orderId: string) {
    try {
        const deletedOrder = await prisma.order.delete({
            where: {
                id: orderId,
                status: "PENDING"
            }
        });
        return { success: true, message: "Pending order deleted successfully" };
    } catch (error) {
        console.error("Error deleting pending order:", error);
        return { success: false, message: "Failed to delete pending order" };
    }
}