const initialState = {
  chats: [
    {
      id: "c1",
      name: "Bob",
      unreadMessageCount: 2,
      messages: [
        {
          id: "1",
          text: "Hello",
          audio: "aaa",
          translation: "",
          translationAudio: "aaa"
        },
        {
          id: "2",
          text: "你好",
          audio: "aaa",
          translation: "hello",
          translationAudio: "aaa"
        },
        {
          id: "3",
          text:
            "Hi, how are you doing? I'm doing pretty well. I'm glad we get to talk on this app. It's so cool!",
          audio: "",
          translation: "",
          translationAudio: ""
        },
        {
          id: "4",
          text: "不错，我也很高兴认识你！",
          audio: "",
          translation: "",
          translationAudio: ""
        },
        {
          id: "5",
          text: "Your Chinese is soooooo gooood! How did you learn?",
          audio: "",
          translation: "你的中文真棒！你怎么学的？",
          translationAudio: ""
        }
      ]
    },
    {
      id: "c2",
      name: "Bill",
      unreadMessageCount: 0,
      messages: [
        {
          id: "4",
          text: "不错，我也很高兴认识你！",
          audio: "",
          translation: "",
          translationAudio: ""
        },
        {
          id: "5",
          text: "Your Chinese is soooooo gooood! How did you learn?",
          audio: "",
          translation: "你的中文真棒！你怎么学的？",
          translationAudio: ""
        }
      ]
    }
  ],
  selectedChatID: null,
  editing: null,
  route: "Chats",
  reviewCards: [],
  reviewing: false
};

export const startEditingMessage = message => ({
  type: "START_EDITING_MESSAGE",
  message
});
export const editText = text => ({ type: "EDIT_TEXT", text });
export const editTranslation = translation => ({
  type: "EDIT_TRANSLATION",
  translation
});
export const startRecording = ({ audioPromise, isTranslation }) => ({
  type: "START_RECORDING",
  audioPromise,
  isTranslation
});
export const stopRecording = audio => ({ type: "STOP_RECORDING", audio });
export const saveMessage = message => ({ type: "SAVE_MESSAGE" });
export const cancelEditingMessage = () => ({ type: "CANCEL_EDITING_MESSAGE" });
export const selectChatID = chatID => ({ type: "SELECT_CHAT_ID", chatID });
export const changeRoute = route => ({ type: "CHANGE_ROUTE", route });
export const addReviewCard = ({ messageID, nextReviewTime }) => ({
  type: "ADD_REVIEW_CARD",
  messageID,
  nextReviewTime
});
export const startReviewing = () => ({ type: "START_REVIEWING" });

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "START_EDITING_MESSAGE":
      return {
        ...state,
        editing: {
          message: action.message,
          recording: null
        }
      };
    case "EDIT_TEXT":
      return {
        ...state,
        editing: {
          ...state.editing,
          message: { ...state.editing.message, text: action.text }
        }
      };
    case "EDIT_TRANSLATION":
      return {
        ...state,
        editing: {
          ...state.editing,
          message: { ...state.editing.message, translation: action.translation }
        }
      };
    case "START_RECORDING":
      return {
        ...state,
        editing: {
          message: state.editing.message,
          recording: {
            audioPromise: action.audioPromise,
            isTranslation: action.isTranslation
          }
        }
      };
    case "STOP_RECORDING":
      return {
        ...state,
        editing: {
          message: {
            ...state.editing.message,
            [state.editing.recording.isTranslation
              ? "translationAudio"
              : "audio"]: action.audio
          },
          recording: null
        }
      };
    case "SAVE_MESSAGE": {
      const chat = state.chats.find(chat => chat.id === state.selectedChatID);
      if (chat.messages.some(m => m.id === state.editing.message.id)) {
        return {
          ...state,
          chats: state.chats.map(
            c =>
              c.id === chat.id
                ? {
                    ...c,
                    messages: c.messages.map(
                      m =>
                        m.id === state.editing.message.id
                          ? state.editing.message
                          : m
                    )
                  }
                : c
          ),
          editing: null
        };
      } else {
        return {
          ...state,
          chats: state.chats.map(
            c =>
              c.id === chat.id
                ? {
                    ...c,
                    messages: [...c.messages, state.editing.message]
                  }
                : c
          ),
          editing: null
        };
      }
    }
    case "CANCEL_EDITING_MESSAGE":
      return {
        ...state,
        editing: null
      };
    case "SELECT_CHAT_ID":
      if (state.chats.some(chat => chat.id === action.chatID)) {
        return {
          ...state,
          chats: state.chats.map(
            chat =>
              chat.id === action.chatID
                ? { ...chat, unreadMessageCount: 0 }
                : chat
          ),
          selectedChatID: action.chatID
        };
      } else {
        return {
          ...state,
          selectedChatID: null
        };
      }
    case "CHANGE_ROUTE":
      return {
        ...state,
        route: action.route
      };
    case "ADD_REVIEW_CARD": {
      const chat = state.chats.find(chat => chat.id === state.selectedChatID);
      const message = chat.messages.find(m => m.id === action.messageID);
      return {
        ...state,
        reviewCards: [
          ...state.reviewCards,
          {
            score: 0,
            nextReviewTime: action.nextReviewTime,
            id: message.id,
            text: message.text,
            audio: message.audio,
            translation: message.translation,
            translationAudio: message.translationAudio
          }
        ]
      };
    }
    case "START_REVIEWING":
      return {
        ...state,
        reviewing: true
      };
    default:
      return state;
  }
};
