// SceneRegistry — maps panel IDs to scene components.
// Kept separate from PanelScenes.jsx so that file only exports React components
// (required for react-refresh fast reload to work correctly).
import { SceneOfficeFocused, SceneOfficePdeciding, SceneOfficeTyping } from './PanelScenes.jsx';

export function getSceneComponent(panel) {
  if (panel.id === 'p1') return SceneOfficeFocused;
  if (panel.id === 'p2') return SceneOfficePdeciding;
  if (panel.id === 'p3') return SceneOfficeTyping;
  return SceneOfficeFocused;
}
