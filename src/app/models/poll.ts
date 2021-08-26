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

  haveMeVoted: boolean;
}

export class PollOption {
  id: bigint;
  value: string;
  votes: number;

  haveMeVoted: boolean;

  constructor(id, value, votes, haveMeVoted) {
    this.id = id;
    this.value = value;
    this.votes = votes;
    this.haveMeVoted = haveMeVoted;
  }
}
