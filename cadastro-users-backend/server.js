import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const app = express();
app.use(express.json());
app.use(cors());

async function hashPassword(password) {
    const salt = await bcrypt.genSalt(8);
    return await bcrypt.hash(password, salt);
}

app.get('/usuarios', async (req, res) => {
    let users = [];

    if(req.query) {
        users = await prisma.user.findMany({
            where: {
                name: req.query.name,
                email: req.query.email,
                password: req.query.password
            }
        })
    } else {
        users = await prisma.user.findMany();
    }

    res.status(200).json(users);
});

app.post('/usuarios', async (req, res) => {
    const hashedPassword = await hashPassword(req.body.password);
    
    await prisma.user.create({
        data: {
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        }
    })
    res.status(201).json({ message: 'Usuário criado com sucesso!' });
});

app.put('/usuarios/:id', async (req, res) => {
    const hashedPassword = await hashPassword(req.body.password);

    await prisma.user.update({
        where: {
            id: req.params.id
        },
        data: {
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        }
    })
    res.status(200).json({ message: 'Usuário atualizado com sucesso!' });
});

app.delete('/usuarios/:id', async (req, res) => {
    await prisma.user.delete({
        where: {
            id: req.params.id
        }
    })
    res.status(200).json({ message: 'Usuário deletado com sucesso!' });
});

app.listen(3000);