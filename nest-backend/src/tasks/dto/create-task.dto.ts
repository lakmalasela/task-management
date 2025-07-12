export class CreateTaskDto {
  title: string;
  description: string;
  dueDate: Date;
  isCompleted: boolean;
  priority: string; 
  category: string; 
  status: string;   
  userId: string;   
}
