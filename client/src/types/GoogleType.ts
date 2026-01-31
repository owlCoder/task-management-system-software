export type GoogleCredentialResponse = {
  credential: string;
};

export type GoogleAccountsId = {
  initialize: (options: {
    client_id: string;
    ux_mode?: "popup" | "redirect";
    auto_select?: boolean;
    cancel_on_tap_outside?: boolean;
    callback: (response: GoogleCredentialResponse) => void | Promise<void>;
  }) => void;

  renderButton: (
    parent: HTMLElement,
    options: {
      theme?: string;
      size?: string;
      text?: string;
      shape?: string;
      width?: number;
      locale?: string;
    }
  ) => void;
};

export type GoogleLike = {
  accounts?: {
    id?: GoogleAccountsId;
  };
};

export type WindowWithGoogle = Window & {
  google?: GoogleLike;
};
