import React, { useCallback, useEffect } from "react";
import { useAsync } from "react-async";
import { Link, RouteComponentProps, useLocation } from "react-router-dom";
import { useBSSession } from "src/stores/BlockstackSessionStore";
import { getCertRecordFromIPFS, saveHashToRemote } from "src/utils/file";
import "./SavePage.css";

const PageContainer: React.FC = ({ children }) => {
  return (
    <div className="d-flex align-items-center justify-content-center savepage">
      <p>
        {children}
      </p>
    </div>
  );
};

export const SavePage: React.FC<RouteComponentProps<{ hash: string }>> = ({ match }) => {

  const location = useLocation();
  const { session } = useBSSession();

  useEffect(() => {
    if (!session.isUserSignedIn()) {
      session.redirectToSignIn(location.pathname);
    }
  }, []);

  const { hash } = match.params;

  const deferFn = useCallback(async ([hash]) => {
    const cert = await getCertRecordFromIPFS(hash, session.loadUserData().appPrivateKey);
    return await saveHashToRemote(session, cert);
  }, [session, hash]);

  const { data, isLoading, run, error } = useAsync({ deferFn });

  useEffect(() => {
    if (!hash) { return; }
    run(hash);
  }, [hash]);

  if (!session.isUserSignedIn()) {
    return (
      <PageContainer >
        即将跳转到登录……
      </PageContainer>
    );
  }

  if (!hash) {
    return (
      <PageContainer>
          请指定要保存的文件的hash。
      </PageContainer>
    );
  }

  return (
    <PageContainer>
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
    </PageContainer>
  );
};
