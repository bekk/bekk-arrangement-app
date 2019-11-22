import { useState, useEffect } from 'react';
import { get } from './crud';
import { Optional } from 'src/types';

// TEMP
const host = 'https://api.dev.bekk.no/arrangement-svc';

interface ICrud<Key, DomainModel, WriteModel, ViewModel> {
  endpoint: (id?: Key) => string;
  fromViewModel: (viewModel: ViewModel) => Optional<DomainModel>;
  toWriteModel: (model: DomainModel) => WriteModel;
}

interface IReturn<Key, DomainModel, WriteModel> {
  collection: DomainModel[];
  create: (model: WriteModel) => void;
  update: (id: Key) => (model: WriteModel) => void;
  del: (id: Key) => void;
}

export const useCrud = <K, D, W, V>({
  endpoint,
  fromViewModel,
  toWriteModel,
}: ICrud<K, D, W, V>): IReturn<K, D, W> => {
  const [collection, setCollection] = useState<D[]>([]);
  const path = endpoint();
  useEffect(() => {
    get({ host, path })
      .then(xs => xs.mapIf(fromViewModel))
      .then(setCollection);
  }, [path]);
  return {
    collection,
    create: () => undefined,
    update: () => () => undefined,
    del: () => undefined,
  };
};
