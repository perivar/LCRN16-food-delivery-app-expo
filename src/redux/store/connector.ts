import { connect, ConnectedProps } from 'react-redux';
import { AppDispatch, RootState } from '.';
import { setSelectedTab } from '../slices/tabs';

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {
    setSelectedTab: (selectedTab: string) =>
      dispatch(setSelectedTab(selectedTab)),
  };
};

const mapStateToProps = (state: RootState) => {
  return {
    selectedTab: state.tabs.selectedTab,
  };
};

// use by class components to connect to Redux instead of connect
export const connector = connect(mapStateToProps, mapDispatchToProps);

// use by class components to get the redux props
// example:
// type Props = PropsFromRedux & {
//    param1: string;
// };
export type PropsFromRedux = ConnectedProps<typeof connector>;
