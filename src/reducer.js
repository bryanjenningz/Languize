const initialState = {
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
  ],
  editing: null
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
    case "SAVE_MESSAGE":
      if (state.messages.some(m => m.id === state.editing.message.id)) {
        return {
          ...state,
          messages: state.messages.map(
            m => (m.id === state.editing.message.id ? state.editing.message : m)
          ),
          editing: null
        };
      } else {
        return {
          ...state,
          messages: [...state.messages, state.editing.message],
          editing: null
        };
      }
    case "CANCEL_EDITING_MESSAGE":
      return {
        ...state,
        editing: null
      };
    default:
      return state;
  }
};
