import { ArtifactPartName } from '@/common/types';
import type * as ArtifactSets from '@/data/artifact-sets';
import ImageService from '@/services/ImageService';
import Image from './Image';

type Props = {
  set: keyof typeof ArtifactSets;
  name: ArtifactPartName;
}

export default function ArtifactImage({ set, name }: Props) {
  return <Image src={ImageService.getArtifactImage(set, name)} alt={name} />;
}