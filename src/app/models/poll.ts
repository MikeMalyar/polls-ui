export class Poll {
  id: bigint;
  title: string;
  description: string;
  dueDate: string;
  requiredForFilling: boolean;
  anonymousForAccessed: boolean;
  anonymousForOwner: boolean;
  anonymousForReacted: boolean;
}
