import amqp from "amqplib"

export const messageQueue = {
    sendMessage: async (queue: string, message: string) => {
        const connection = await amqp.connect(process.env.RABBITMQ_SERVER)
        const channel = await connection.createChannel();

        await channel.assertQueue(queue, {
            durable: true,
        })

        await channel.sendToQueue(queue, Buffer.from(message))

        setTimeout(() => connection.close())
    }
}