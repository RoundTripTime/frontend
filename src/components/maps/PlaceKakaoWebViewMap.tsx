import { type ViewStyle } from 'react-native';

import { KakaoWebViewMap } from './KakaoWebViewMap';

type PlaceKakaoWebViewMapProps = {
  latitude: number;
  longitude: number;
  name?: string;
  style?: ViewStyle;
};

export function PlaceKakaoWebViewMap({
  latitude,
  longitude,
  name = 'place',
  style,
}: PlaceKakaoWebViewMapProps) {
  return (
    <KakaoWebViewMap
      markers={[{ id: name, latitude, longitude, order: 1, title: name }]}
      style={style}
    />
  );
}
