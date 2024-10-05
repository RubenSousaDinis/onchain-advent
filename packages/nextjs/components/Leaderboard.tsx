/**
 * Site footer
 */
import { Link } from "lucide-react";
import Image from "next/image";

export const Leaderboard = () => {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th>Sponsor</th>
            <th>Sponsored Amount</th>
            <th>Bio</th>
            <th>Talent Passport</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div className="flex items-center gap-3">
                <div className="avatar">
                  <div className="mask mask-squircle h-12 w-12">
                    <Image
                      src="https://img.daisyui.com/images/profile/demo/2@94.webp"
                      alt="Avatar Tailwind CSS Component"
                    />
                  </div>
                </div>
                <div>
                  <div className="font-bold">Hart Hagerty</div>
                  <div className="text-sm opacity-50">100</div>
                </div>
              </div>
            </td>
            <td>
              <div className="badge badge-accent">2 ETH</div>
            </td>
            <td>Zemlak, Daniel and Leannon</td>
            <th>
              <button className="btn btn-ghost">
                <Link className="w-5 h-5 text-blue-500" />
              </button>
            </th>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
