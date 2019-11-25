import { useState, useEffect, useCallback } from 'react';
import { get, post, put, del } from './crud';
import { Optional, WithId } from 'src/types';

// TEMP
const host = 'http://localhost:5000';

interface ICrud<Key, DomainModel, WriteModel, ViewModel> {
  endpoint: (id?: Key) => string;
  fromViewModel: (viewModel: ViewModel) => Optional<WithId<DomainModel>>;
  toWriteModel: (model: DomainModel) => WriteModel;
}

interface IReturn<Key, DomainModel> {
  collection: WithId<DomainModel>[];
  create: (model: DomainModel) => Promise<void>;
  update: (id: Key) => (model: DomainModel) => Promise<void>;
  del: (id: Key) => Promise<void>;
}

export const useCrud = <K, D, W, V>({
  endpoint,
  fromViewModel,
  toWriteModel,
}: ICrud<K, D, W, V>): IReturn<K, D> => {
  const [collection, setCollection] = useState<WithId<D>[]>([]);
  const path = endpoint();
  const getAll = useCallback(() => {
    get({ host, path })
      .then(xs => xs.mapIf(fromViewModel))
      .then(setCollection);
  }, [path]);
  useEffect(getAll, [getAll]);
  return {
    collection,
    create: write =>
      post({ host, path, body: toWriteModel(write) }).then(getAll),
    update: id => write =>
      put({ host, path: endpoint(id), body: toWriteModel(write) }).then(getAll),
    del: id => del({ host, path: endpoint(id) }).then(getAll),
  };
};
