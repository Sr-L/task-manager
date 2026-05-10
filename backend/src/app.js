import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from '../docs/swagger.js';

import { MongoUserRepository } from './contexts/auth/infrastructure/mongo.user.repository.js';
import { MongoTaskRepository } from './contexts/tasks/infrastructure/mongo.task.repository.js';
import { JwtService } from './contexts/auth/infrastructure/jwt.service.js';
import { BcryptPasswordHasher } from './contexts/auth/infrastructure/bcrypt.password.hasher.js';
import { RegisterUserUseCase } from './contexts/auth/application/register.user.use-case.js';
import { LoginUserUseCase } from './contexts/auth/application/login.user.use-case.js';
import { CreateTaskUseCase } from './contexts/tasks/application/create.task.use-case.js';
import { ListTasksUseCase } from './contexts/tasks/application/list.tasks.use-case.js';
import { CompleteTaskUseCase } from './contexts/tasks/application/complete.task.use-case.js';
import { DeleteTaskUseCase } from './contexts/tasks/application/delete.task.use-case.js';
import { AuthController } from './contexts/auth/infrastructure/auth.controller.js';
import { TaskController } from './contexts/tasks/infrastructure/task.controller.js';
import { createAuthRouter } from './contexts/auth/infrastructure/auth.routes.js';
import { createTaskRouter } from './contexts/tasks/infrastructure/task.routes.js';
import { createAuthMiddleware } from './contexts/auth/infrastructure/auth.middleware.js';
import { notFoundHandler } from './shared/middlewares/not.found.handler.js';
import { errorHandler } from './shared/middlewares/error.handler.js';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Swagger UI
  app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Health check
  app.get('/health', (_req, res) => {
    res.json({ success: true, message: 'OK' });
  });

  // Repositories
  const userRepository = new MongoUserRepository();
  const taskRepository = new MongoTaskRepository();

  // Services
  const jwtService = new JwtService();
  const passwordHasher = new BcryptPasswordHasher();

  // Use cases
  const registerUseCase = new RegisterUserUseCase(userRepository, jwtService, passwordHasher);
  const loginUseCase = new LoginUserUseCase(userRepository, jwtService, passwordHasher);
  const createTaskUseCase = new CreateTaskUseCase(taskRepository);
  const listTasksUseCase = new ListTasksUseCase(taskRepository);
  const completeTaskUseCase = new CompleteTaskUseCase(taskRepository);
  const deleteTaskUseCase = new DeleteTaskUseCase(taskRepository);

  // Controllers
  const authController = new AuthController(registerUseCase, loginUseCase);
  const taskController = new TaskController(createTaskUseCase, listTasksUseCase, completeTaskUseCase, deleteTaskUseCase);

  // Middlewares
  const authMiddleware = createAuthMiddleware(jwtService);

  // Routers
  app.use('/api/v1/auth', createAuthRouter(authController));
  app.use('/api/v1/tasks', createTaskRouter(taskController, authMiddleware));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
