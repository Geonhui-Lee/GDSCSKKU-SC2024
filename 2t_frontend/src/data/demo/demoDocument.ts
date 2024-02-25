import { MessagesDocuments } from "data/standard/document/messages";
import { ProtectorInvestigation, ProtectorRecord, ProtectorReport } from "data/standard/document/protector";
import { TelenotesDocument, TelenotesManifest, TelenotesManifests } from "data/standard/document/telenotes";

export const generateDemoData = {
  id: (): string => {
    return Math.random().toString(36).substring(7);
  },
  telenotesManifest: (id: string): TelenotesManifest => {
    return {
      id: id,
      time: {
        created: new Date(),
      },
      info: {
        contact: {
          name: "John Doe",
          phoneNumber: "1234567890",
        },
        title: "Demo Node (" + id + ")",
      }
    }
  },
  telenotesDocument: (id: string): TelenotesDocument => {
    return {
      id: id,
      manifestInfo: {
        contact: {
          name: "John Doe",
          phoneNumber: "1234567890",
        },
        title: "Demo Node (" + id + ")",
      },
      transcript: [
          {
              speakerTag: "user",
              content: id
          },
          {
              speakerTag: "user",
              content: "Hello, this is a demo transcript."
          },
          {
            speakerTag: "opponent",
              content: "Hi, I received your transcript."
          }
      ],
      summary: {
        description: "This is a demo summary of the demo transcript.",
          lists: ["list1", "list2"],
          keywords: ["keyword1", "keyword2"]
      }
    }
  }
}

export const demoTelenotes: TelenotesManifests = [
  {
    id: "1",
    time: {
      created: new Date(),
    },
    info: {
      contact: {
        name: "John Doe",
        phoneNumber: "1234567890",
      },
      title: "First Note",
    }
  },
  {
    id: "2",
    time: {
      created: new Date(),
      modified: new Date(),
    },
    info: {
      contact: {
        name: "Jane Doe",
        phoneNumber: "0987654321",
      },
      title: "Second Note",
    }
  },
]

export const demoTelenotesDocument: TelenotesDocument = {
  id: "1",
  manifestInfo: {
    contact: {
      name: "John Doe",
      phoneNumber: "1234567890",
    },
    title: "First Note",
  },
  transcript: [
      {
          speakerTag: "user",
          content: "Hello, this is a demo transcript."
      },
      {
        speakerTag: "opponent",
          content: "Hi, I received your transcript."
      }
  ],
  summary: {
      description: "This is a demo summary of the demo transcript.",
      lists: ["list1", "list2"],
      keywords: ["keyword1", "keyword2"]
  },
  media: {
    type: "url",
    url: "https://safebooru.org//images/4553/389664ca99ed7a40cbff9c5ba74a07ec587006a3.jpg?4747857"
  }
};

export const demoProtectorReport: ProtectorReport = {
  time: {
    modified: new Date()
  },
  status: "safe"
};

export const demoMessages: MessagesDocuments = [
  {
    type: "sms",
    contact: {
      name: "John Doe",
      phoneNumber: "1234567890",
    },
    chat: [
      {
        sender: "user",
        message: "Hello, this is a demo chat.",
        time: new Date()
      },
      {
        sender: "opponent",
        message: "Hi, I received your chat.",
        time: new Date()
      }
    ]
  }
];

export const demoProtectorRecord: ProtectorRecord[] = [{
  id: "1",
  type: "sms",
  time: {
    created: new Date(),
  },
  score: 80,
  contact: {
    name: "John Doe",
    phoneNumber: "1234567890",
  },
  data: {
    messagesDocument: demoMessages[0],
    suspiciousParts: ["suspiciousPart1", "suspiciousPart2"]
  }
},
{
  id: "2",
  type: "call",
  time: {
    created: new Date(),
  },
  score: 85,
  contact: {
    name: "Jane Doe",
    phoneNumber: "1234567890",
  },
  data: {
    messagesDocument: demoMessages[0],
    suspiciousParts: ["suspiciousPart1", "suspiciousPart2"]
  }
}
]

export const demoProtectorInvestigations: ProtectorInvestigation[] = [
  {
    id: "1",
    time: {
      created: new Date(),
      modified: new Date(),
    },
    case: {
      contact: {
        name: "John Doe",
        phoneNumber: "1234567890",
      },
      records: demoProtectorRecord
    },
    result: {
      status: "safe",
      score: 0,
      author: {
        association: "association",
        name: "John Doe",
        email: ""
      },
      comments: []
    }
  }
]