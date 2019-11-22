import { useState, useEffect, useCallback } from 'react';
import { get, post } from './crud';
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
  create: (model: WriteModel) => Promise<void>;
  update: (id: Key) => (model: WriteModel) => Promise<void>;
  del: (id: Key) => Promise<void>;
}

export const useCrud = <K, D, W, V>({
  endpoint,
  fromViewModel,
  toWriteModel,
}: ICrud<K, D, W, V>): IReturn<K, D, W> => {
  const [collection, setCollection] = useState<D[]>([]);
  const path = endpoint();
  const getAll = useCallback(() => {
    get({ host, path })
      .then(xs => xs.mapIf(fromViewModel))
      .then(setCollection);
  }, [path]);
  useEffect(getAll, [getAll]);
  return {
    collection,
    create: write => post({ host, path, body: write }).then(getAll),
    update: () => () => Promise.resolve(),
    del: () => Promise.resolve(),
  };
};
