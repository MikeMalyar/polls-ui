export class Poll {
  id: bigint;
  title: string;
  description: string;
  dueDate: string;
  requiredForFilling: boolean;
  anonymousForAccessed: boolean;
  anonymousForOwner: boolean;
  anonymousForReacted: boolean;

  options: PollOption[];
}

export class PollOption {
  id: bigint;
  value: string;

  constructor(id, value) {
    this.id = id;
    this.value = value;
  }
}
