export class Poll {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  requiredForFilling: boolean;
  anonymousForAccessed: boolean;
  anonymousForOwner: boolean;
  anonymousForReacted: boolean;

  options: PollOption[];

  haveMeVoted: boolean;

  groupNames: string[];
}

export class PollOption {
  id: number;
  value: string;
  votes: number;

  haveMeVoted: boolean;

  usersVoted: string[];

  constructor(id, value, votes, haveMeVoted) {
    this.id = id;
    this.value = value;
    this.votes = votes;
    this.haveMeVoted = haveMeVoted;
  }
}
