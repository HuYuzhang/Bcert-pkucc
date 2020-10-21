import React, { useCallback, useEffect } from "react";
import { useAsync } from "react-async";
import { Link, RouteComponentProps } from "react-router-dom";
import { CenteredTextLayout } from "src/layout/CenteredTextLayout";
import {
  useBSSession,
  useHandlingPendingSignInEffect,
} from "src/stores/BlockstackSessionStore";
import {
  getCertRecordFromIPFS,
  isDecryptionFailed,
  saveHashToRemote,
} from "src/utils/file";

export const SavePage: React.FC<RouteComponentProps<{ hash: string }>> = ({ match }) => {

  const { session } = useBSSession();

  useHandlingPendingSignInEffect();

  const { hash } = match.params;

  const deferFn = useCallback(async ([hash]) => {
    try {
      const cert = await getCertRecordFromIPFS(hash,
        session.loadUserData().appPrivateKey);
      return await saveHashToRemote(session, cert);
    } catch (e) {
      console.log(e);
      if (isDecryptionFailed(e)) {
        return "NotOwner";
      }
    }
  }, [session, hash]);

  const { data, isLoading, run, error } = useAsync({ deferFn });

  useEffect(() => {
    if (!hash) { return; }
    run(hash);
  }, [hash]);

  if (!session.isUserSignedIn()) {
    return (
      <CenteredTextLayout >
        即将跳转到登录……
      </CenteredTextLayout>
    );
  }

  if (!hash) {
    return (
      <CenteredTextLayout>
          请指定要保存的文件的hash。
      </CenteredTextLayout>
    );
  }

  return (
    <CenteredTextLayout>
      {
        isLoading
          ? (
            <p>
              正在保存文件 {hash} 到您的账户……
            </p>
          )
          : error
            ? (
              <p>
            下载文件失败，请检查hash是否正确。
              </p>
            )
            : <>
              <p>
                {
                  data === "Success"
                    ? "保存成功！"
                    : data === "Dup"
                      ? "您已经保存了这一份文件"
                      : data === "NotOwner"
                        ? "这份文件不属于您，不能保存到您的账号里。"
                        : undefined
                }
              </p>
              <p>
                <Link to="/dashboard">
              点击这里跳转到个人中心
                </Link>
              </p>
            </>

      }
    </CenteredTextLayout>
  );
};
