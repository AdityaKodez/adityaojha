"use client";

import { TodoList, type TodoListProps } from "@/components/ui/todo-list";

const TASKS = [
  { id: "user-testing", title: "Organize a user testing session" },
  { id: "client-review", title: "Prepare designs for client review" },
  { id: "meditation", title: "15-minute meditation" },
];

export function TodoListDemo(props: Partial<TodoListProps> = {}) {
  return (
    <div className="flex min-h-80 w-full items-center justify-center rounded-xl bg-muted px-4 py-10">
      <TodoList defaultItems={TASKS} {...props} />
    </div>
  );
}
