import React, { Component } from "react";
import { connect } from "react-redux";
import { Menu, Icon } from "semantic-ui-react";
import { setCurrentChannel, setPrivateChannel } from "../../../redux/actions/channelActions";
import { ref, onChildAdded, onChildRemoved, off } from "firebase/database";
import { realtimeDb } from "../../../firebase";
import { User } from "firebase/auth";

// Channel type
interface Channel {
  id: string;
  name: string;
  [key: string]: any;
}

// Props directly passed from parent component
interface OwnProps {
  currentUser: User | null;
}

// Props from Redux (connected)
interface ReduxProps {
  setCurrentChannel: (channel: Channel) => void;
  setPrivateChannel: (isPrivate: boolean) => void;
}

type Props = OwnProps & ReduxProps;

interface State {
  activeChannel: string;
  starredChannels: Channel[];
}

class Starred extends Component<Props, State> {
  state: State = {
    activeChannel: "",
    starredChannels: [],
  };

  componentDidMount() {
    const { currentUser } = this.props;
    if (currentUser) {
      this.addListeners(currentUser.uid);
    }
  }

  componentWillUnmount() {
    const { currentUser } = this.props;
    if (currentUser) {
      off(ref(realtimeDb, `users/${currentUser.uid}/starred`));
    }
  }

  addListeners = (userId: string) => {
    const starredRef = ref(realtimeDb, `users/${userId}/starred`);

    onChildAdded(starredRef, (snap) => {
      const starredChannel = { id: snap.key!, ...snap.val() };
      this.setState((prevState) => ({
        starredChannels: [...prevState.starredChannels, starredChannel],
      }));
    });

    onChildRemoved(starredRef, (snap) => {
      const removedId = snap.key!;
      this.setState((prevState) => ({
        starredChannels: prevState.starredChannels.filter((channel) => channel.id !== removedId),
      }));
    });
  };

  setActiveChannel = (channel: Channel) => {
    this.setState({ activeChannel: channel.id });
  };

  changeChannel = (channel: Channel) => {
    this.setActiveChannel(channel);
    this.props.setCurrentChannel(channel);
    this.props.setPrivateChannel(false);
  };

  displayChannels = (channels: Channel[]) =>
    channels.length > 0 &&
    channels.map((channel) => (
      <Menu.Item
        key={channel.id}
        onClick={() => this.changeChannel(channel)}
        name={channel.name}
        style={{ opacity: 0.7 }}
        active={channel.id === this.state.activeChannel}
      >
        # {channel.name}
      </Menu.Item>
    ));

  render() {
    const { starredChannels } = this.state;

    return (
      <Menu.Menu className="menu">
        <Menu.Item>
          <span>
            <Icon name="star" /> FAVORITES
          </span>{" "}
          ({starredChannels.length})
        </Menu.Item>
        {this.displayChannels(starredChannels)}
      </Menu.Menu>
    );
  }
}

// Connect Redux props
export default connect<undefined, ReduxProps, OwnProps>(
  undefined,
  { setCurrentChannel, setPrivateChannel }
)(Starred);