import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Priority } from '../shared/enum/priority.enum';
import { Category } from '../shared/enum/category.enum';
import { Status } from '../shared/enum/status.enum';
import { User } from '../user/user.entity';
import { PaginationDto } from '../pagination/dto/pagination.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  //create task
  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    try {
      const { userId, priority, category, status, ...rest } = createTaskDto;
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) throw new NotFoundException(`User with id ${userId} not found`);
      const task = this.taskRepository.create({
        ...rest,
        user,
        priority: priority as Priority,
        category: category as Category,
        status: status as Status,
      });
      return await this.taskRepository.save(task);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException(error.message || 'Failed to create task');
    }
  }

  //all tasks
  async findAll(paginationDto?: PaginationDto): Promise<{ tasks: Task[]; total: number; page: number; limit: number; totalPages: number }> {
    try {
      const { page = 1, limit = 10 } = paginationDto || {};
      const skip = (page - 1) * limit;
      
      const [tasks, total] = await this.taskRepository.findAndCount({
        skip,
        take: limit,
        order: { created_at: 'DESC' },
        // where: { status: Not(Status.DELETED) }
      });

      const totalPages = Math.ceil(total / limit);

      return {
        tasks,
        total,
        page,
        limit,
        totalPages
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch tasks');
    }
  }

  //find task by id
  async findOne(id: string): Promise<Task> {
    try {
      const task = await this.taskRepository.findOne({ where: { id } });
      if (!task) {
        throw new NotFoundException(`Task with id ${id} not found`);
      }
      return task;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch task');
    }
  }

  //update task
  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    try {
      const task = await this.findOne(id);
      if (updateTaskDto.userId) {
        const user = await this.userRepository.findOne({ where: { id: updateTaskDto.userId } });
        if (!user) throw new NotFoundException(`User with id ${updateTaskDto.userId} not found`);
        task.user = user;
      }
      if (updateTaskDto.priority) task.priority = updateTaskDto.priority as Priority;
      if (updateTaskDto.category) task.category = updateTaskDto.category as Category;
      if (updateTaskDto.status) task.status = updateTaskDto.status as Status;
      if (updateTaskDto.title !== undefined) task.title = updateTaskDto.title;
      if (updateTaskDto.description !== undefined) task.description = updateTaskDto.description;
      if (updateTaskDto.dueDate !== undefined) task.dueDate = updateTaskDto.dueDate;
      // if (updateTaskDto.isCompleted !== undefined) task.isCompleted = updateTaskDto.isCompleted;
      return await this.taskRepository.save(task);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException(error.message || 'Failed to update task');
    }
  }

  //soft delete the task
  async remove(id: string): Promise<Task> {
    try {
      const task = await this.findOne(id);
      task.status = Status.DELETED;
      return await this.taskRepository.save(task);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete task');
    }
  }
}
