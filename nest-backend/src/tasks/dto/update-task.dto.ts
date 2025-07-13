import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto {
  title?: string;
  description?: string;
  dueDate?: Date;
  priority?: string; 
  category?: string;
  status?: string;   
  userId?: string;   
}
