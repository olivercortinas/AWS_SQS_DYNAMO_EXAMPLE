# AWS SQS & DynamoDB Example with Node.js and React

Este proyecto es un ejemplo sencillo de integración entre **AWS SQS (Simple Queue Service)** y **DynamoDB** utilizando un backend en **Node.js** y un frontend en **React**. El backend maneja el envío de mensajes a una cola SQS y la inserción de esos mensajes en una tabla DynamoDB. El frontend permite enviar nuevos procesos y monitorear el estado de los mensajes.

## Características

- **Backend**:
  - Envía mensajes a una cola SQS.
  - Recibe y procesa mensajes de SQS, almacenándolos en DynamoDB.
  
- **Frontend**:
  - Interfaz web que permite enviar nuevos procesos (mensajes) y mostrar el estado de los procesos almacenados.

## Tecnologías Utilizadas

- **Backend**:
  - Node.js
  - Express
  - AWS SDK (v3) para interactuar con SQS y DynamoDB
- **Frontend**:
  - React
  - Axios para hacer solicitudes HTTP

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalados los siguientes programas:

- [Node.js](https://nodejs.org/) (versión 18 o superior)
- [npm](https://www.npmjs.com/)
- Una cuenta de AWS con acceso a SQS y DynamoDB

# Ejercicio:

###  - Se debe almacenar el objeto cuando se envía un mensaje a la cola de SQS con el estado `PENDING` y cuando se procesa el mensaje se debe actualizar el estado a `COMPLETED`.

### - Se debe crear un endpoint en el backend que sea consumido por el frontend para obtener todos los mensajes almacenados en la tabla de DynamoDB y mostrarlos en la interfaz con su respectivo estado.

### - Se debe crear un mecanismo que pregunte cada 5 segundos si hay mensajes en la cola de SQS para procesarlos y almacenarlos en la tabla de DynamoDB, si esta activa la variable de entorno `PROCESS_MESSAGES_AUTOMATICALLY`.
